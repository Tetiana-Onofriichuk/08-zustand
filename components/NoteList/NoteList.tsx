"use client";

import Link from "next/link";
import css from "./NoteList.module.css";
import type { Note, NoteId } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import { useState } from "react";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<NoteId | null>(null);

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id: NoteId) => deleteNote(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingId(null);
    },
    onError(error) {
      console.error("Error deleting note:", error);
      setDeletingId(null);
    },
  });

  if (!notes || notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag || "No tag"}</span>

            <Link
              href={`/notes/${note.id}`}
              className={css.link}
              aria-label={`View details of note ${note.title}`}
            >
              View details
            </Link>

            <button
              className={css.button}
              onClick={() => {
                setDeletingId(note.id);
                deleteMutation(note.id);
              }}
              disabled={deletingId === note.id}
            >
              {deletingId === note.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
