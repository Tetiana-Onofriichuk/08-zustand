import css from "./CreateNote.module.css";
import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Note: create new note`,
    description: "New note creation data",
    openGraph: {
      title: `Note: create new note`,
      description: "New note creation data",
      url: `https://08-zustand-phi-three.vercel.app/notes/action/create`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://blues.com/wp-content/uploads/2023/02/notehub-js.webp",
          width: 1200,
          height: 630,
          alt: "Note: create new note",
        },
      ],
      type: "article",
    },
  };
}

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
