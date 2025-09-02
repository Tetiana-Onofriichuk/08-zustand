import { useDebouncedCallback } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (value: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value),
    300
  );

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={updateSearchQuery}
    />
  );
}
