export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: "Work" | "Personal" | "Meeting" | "Shopping" | "Todo";
}

export type NoteId = Note["id"];
export type Tag = Note["tag"];
export type SortBy = "title" | "createdAt" | "updatedAt";

export const CATEGORIES = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryNoAll = Exclude<Category, "All">;
