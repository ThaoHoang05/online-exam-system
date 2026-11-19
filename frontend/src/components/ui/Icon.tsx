const paths = {
  ticket: "M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z M13 6v2m0 3v2m0 3v2",
  user: "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M5 21v-2a7 7 0 0 1 14 0v2",
  door: "M4 21h16M7 21V5l10-2v18m-4-9h1",
  clock: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 6v6l4 2",
  arrow: "M4 12h15m-6-6 6 6-6 6",
  chevron: "m9 6 6 6-6 6",
  book: "M12 5C9 3 6 3 3 4v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1zm0 0v15",
  chart: "M4 3v17h17M9 16v-6m5 6V6m5 10v-8",
  check: "M4 4h16v16H4z M8 12l3 3 5-6",
  edit: "M12 4H4v16h16v-8m-11 3 1-4 7-7 3 3-7 7z",
};

export type IconName = keyof typeof paths;

export function Icon({ name }: { name: IconName }) {
  return (
    <svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}
