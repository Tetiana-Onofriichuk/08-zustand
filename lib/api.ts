import axios from "axios";
import type { Note, NoteId, SortBy, CategoryNoAll } from "@/types/note";
import { CATEGORIES } from "@/types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

if (process.env.NEXT_PUBLIC_NOTEHUB_TOKEN) {
  axios.defaults.headers.common["Authorization"] =
    `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search?: string,
  tag?: CategoryNoAll,
  sortBy?: SortBy
): Promise<NotesResponse> {
  const params: Record<string, string> = {
    page: String(page),
    perPage: String(perPage),
  };

  if (search) params.search = search;
  if (tag) params.tag = tag;
  if (sortBy) params.sortBy = sortBy;

  const { data } = await axios.get<NotesResponse>("/notes", { params });
  return data;
}

export async function createNote(
  newNote: Omit<Note, "id" | "createdAt" | "updatedAt">
) {
  const { data } = await axios.post<Note>("/notes", newNote);
  return data;
}

export async function deleteNote(noteId: NoteId): Promise<Note> {
  const { data } = await axios.delete<Note>(`/notes/${noteId}`);
  return data;
}

export async function fetchNoteById(noteId: NoteId): Promise<Note> {
  const { data } = await axios.get<Note>(`/notes/${noteId}`);
  return data;
}

export const getCategories = () => CATEGORIES;
