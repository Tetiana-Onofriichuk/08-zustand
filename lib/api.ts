import axios from "axios";
import type { Note } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] =
  `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

if (
  process.env.NODE_ENV !== "production" &&
  !process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
) {
  console.warn(
    "NEXT_PUBLIC_NOTEHUB_TOKEN is missing — POST/DELETE will fail with 401/403"
  );
}

const Tags = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;
export type Tag = (typeof Tags)[number];
export const getCategories = () => Tags;

type SortBy = "created" | "updated";

export interface FetchNotes {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string,
  tag?: Exclude<Tag, "All">,
  sortBy?: SortBy
): Promise<FetchNotes> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };
  if (search) params.search = search;
  if (tag) params.tag = tag;
  if (sortBy) params.sortBy = sortBy;

  const { data } = await axios.get<FetchNotes>("/notes", { params });
  return data;
};

export const createNote = async (
  newNote: Pick<Note, "title" | "content" | "tag">
): Promise<Note> => {
  const { data } = await axios.post<Note>("/notes", newNote);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`/notes/${id}`);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`);
  return data;
};
