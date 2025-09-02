"use client";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface NotePreviewClientProps {
  id: string;
}

const NotePreviewClient = ({ id }: NotePreviewClientProps) => {
  const router = useRouter();
  const onClose = () => router.back();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Could not fetch note. {error?.message}</p>;

  return (
    <Modal onClose={onClose}>
      <h2>{note.title}</h2>
      <b>{note.tag}</b>
      <p>{note.content}</p>
      <p>{note.updatedAt ?? note.createdAt}</p>
    </Modal>
  );
};

export default NotePreviewClient;
