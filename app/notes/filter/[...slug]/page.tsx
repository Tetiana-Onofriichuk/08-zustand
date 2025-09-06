import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { CATEGORIES, type Category, type CategoryNoAll } from "@/types/note";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  const slug = params.slug?.[0];

  if (!slug || !CATEGORIES.includes(slug as Category)) {
    return {
      title: "NoteHub - Not Found",
      description: "The requested category does not exist.",
    };
  }

  const tag = slug as Category;

  return {
    title: `NoteHub - ${tag}`,
    description: `Browse notes filtered by category: ${tag}.`,
    openGraph: {
      title: `NoteHub - ${tag}`,
      description: `Browse notes filtered by category: ${tag}.`,
      url: `https://08-zustand-phi-three.vercel.app/notes/${tag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Notehub",
        },
      ],
      type: "website",
    },
  };
}

export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: [c] }));
}

type Props = { params: Promise<{ slug?: string[] }> };

export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  const tag = slug[0] as Category | undefined;
  if (!tag || !CATEGORIES.includes(tag)) notFound();

  const category: CategoryNoAll | undefined =
    tag === "All" ? undefined : (tag as CategoryNoAll);

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: [
      "notes",
      { page: 1, perPage: 8, search: "", tag: category ?? null },
    ],
    queryFn: () => fetchNotes(1, 8, undefined, category),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient tag={category} />
    </HydrationBoundary>
  );
}
