import Link from "next/link";
import { CATEGORIES } from "@/types/note";

export default function SidebarNotes() {
  return (
    <ul
      style={{
        listStyle: "none",
        margin: 0,
        padding: 12,
        display: "grid",
        gap: 8,
      }}
    >
      {CATEGORIES.map((category) => (
        <li key={category}>
          <Link
            href={`/notes/filter/${category}`}
            scroll={false}
            style={{ color: "#fff" }}
          >
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
}
