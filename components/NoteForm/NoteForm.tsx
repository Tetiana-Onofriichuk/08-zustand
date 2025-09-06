"use client";

import css from "./NoteForm.module.css";
import type { Tag } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { useEffect, useMemo, useState } from "react";

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
  const isCreate = pathname === "/notes/action/create";

  const draft = useNoteDraftStore((s) => s.draft);
  const setDraft = useNoteDraftStore((s) => s.setDraft);
  const clearDraft = useNoteDraftStore((s) => s.clearDraft);

  const [local, setLocal] = useState<NoteFormValues>(initialValues ?? DEFAULTS);

  useEffect(() => {
    if (!isCreate && initialValues) setLocal(initialValues);
  }, [isCreate, initialValues]);

  const values: NoteFormValues = useMemo(
    () => (isCreate ? draft : local),
    [isCreate, draft, local]
  );

  const handleCancel =
    onCancel ??
    (() => {
      if (isCreate) router.back();
      else router.push("/notes");
    });

  const update = (patch: Partial<NoteFormValues>) => {
    if (isCreate) setDraft({ ...draft, ...patch });
    else setLocal((prev) => ({ ...prev, ...patch }));
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newNote: NoteFormValues) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const title = values.title.trim();
    const content = values.content ?? "";
    const tag = values.tag;

    if (title.length < 3 || title.length > 50) return;
    if (content.length > 500) return;
    if (!TAGS.includes(tag)) return;

    mutation.mutate(
      { title, content, tag },
      {
        onSuccess: () => {
          clearDraft();

          router.back();
        },
      }
    );
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={values.title}
          onChange={(e) => update({ title: e.target.value })}
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
          value={values.content}
          onChange={(e) => update({ content: e.target.value })}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={values.tag}
          onChange={(e) => update({ tag: e.target.value as Tag })}
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
          disabled={mutation.isPending}
        >
          Cancel
        </button>

        <button
          className={css.submitButton}
          disabled={mutation.isPending}
          type="submit"
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
