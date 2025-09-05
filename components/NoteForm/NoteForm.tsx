"use client";

import css from "./NoteForm.module.css";
import type { Tag } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";

export interface NoteFormValues {
  title: string;
  content: string;
  tag: Tag;
}

interface NoteFormProps {
  initialValues?: NoteFormValues;
  onCancel?: () => void;
}

const TAGS: readonly Tag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

const DEFAULTS: NoteFormValues = { title: "", content: "", tag: "Todo" };

export default function NoteForm({ initialValues, onCancel }: NoteFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const handleCancel = onCancel ?? (() => router.push("/notes"));

  const draft = useNoteDraftStore((s) => s.draft);
  const clearDraft = useNoteDraftStore((s) => s.clearDraft);

  const init: NoteFormValues =
    pathname === "/notes/action/create"
      ? (draft ?? DEFAULTS)
      : (initialValues ?? DEFAULTS);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: NoteFormValues) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreate = async (formData: FormData) => {
    const title = (formData.get("title") ?? "").toString().trim();
    const content = (formData.get("content") ?? "").toString();
    const tag = (formData.get("tag") ?? init.tag).toString() as Tag;

    if (title.length < 3 || title.length > 50) return;
    if (content.length > 500) return;
    if (!TAGS.includes(tag)) return;

    mutation.mutate(
      { title, content, tag },
      {
        onSuccess: () => {
          (
            document.getElementById("note-form") as HTMLFormElement | null
          )?.reset();
          clearDraft();
          handleCancel();
        },
      }
    );
  };

  return (
    <form id="note-form" className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          defaultValue={init.title}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={init.content}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={init.tag}
          required
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className={css.submitButton}
          disabled={mutation.isPending}
          formAction={handleCreate}
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
