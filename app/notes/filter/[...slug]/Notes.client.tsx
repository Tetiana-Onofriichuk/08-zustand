"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import css from "./Notesclient.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { type CategoryNoAll } from "@/types/note";

type NotesClientProps = {
  tag?: CategoryNoAll;
};

const PER_PAGE = 8;

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput, tag]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [
      "notes",
      { page: currentPage, perPage: PER_PAGE, search, tag: tag ?? null },
    ],
    queryFn: () => fetchNotes(currentPage, PER_PAGE, search || undefined, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 30_000,
  });

  const notes = data?.notes ?? [];
  const hasResults = notes.length > 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchInput} />
        <Link
          href="/notes/action/create"
          className={css.button}
          aria-label="Create a new note"
        >
          Create note +
        </Link>
      </header>

      <main className="notes-list">
        {isLoading && <p>Loading…</p>}
        {isError && <p>Something went wrong.</p>}
        {!isLoading && <NoteList notes={notes} />}

        {hasResults && totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        {isFetching && !isLoading && <p>Updating…</p>}
      </main>
    </div>
  );
}
