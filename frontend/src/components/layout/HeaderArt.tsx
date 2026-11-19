const illustrations = {
  logo: (
    <>
      <path fill="#ffce6a" stroke="#302540" strokeWidth="2" d="m6 8 18-4 4 22-18 4z" />
      <path fill="#fff8e7" stroke="#302540" strokeWidth="2" strokeLinejoin="round" d="m3 5 16 1 5 6-2 15-20-2z" />
      <path fill="#b8a1fa" d="m18 7 1 5 4 1z" />
      <path fill="#503797" d="m6 12 14 1-1 8-14-1z" />
      <path fill="#fff" d="m8 14 2 .2-.2 3-2-.2zm7 .6 2 .2-.2 3-2-.2z" />
      <path fill="none" stroke="#302540" strokeWidth="1.7" strokeLinecap="round" d="m10 23 4 .4" />
    </>
  ),
  door: (
    <>
      <path fill="#ad98ef" d="M5 28V6a3 3 0 0 1 3-3h17a2 2 0 0 1 2 2v23z" />
      <path fill="#5941ac" d="m9 8 13-3v24L9 27z" />
      <circle cx="18.5" cy="17" r="1.7" fill="#ffe286" />
      <path stroke="#46337e" strokeWidth="2.5" strokeLinecap="round" d="M4 28h24" />
    </>
  ),
  book: (
    <>
      <path fill="#b16d1a" d="M2 7q8-3 14 1 6-4 14-1v19q-7-2-14 2-7-4-14-2z" />
      <path fill="#ffdc81" d="M3 4q7-2 13 2v19q-6-4-13-2z" />
      <path fill="#efae39" d="M16 6q6-4 13-2v19q-7-2-13 2z" />
      <path fill="none" stroke="#956120" strokeWidth="2" strokeLinecap="round" d="m6 10 5 1m-5 4 4 1m10-6 5-1" />
    </>
  ),
  chart: (
    <>
      <rect x="3" y="16" width="7" height="11" rx="2" fill="#87bda4" />
      <rect x="12" y="10" width="7" height="17" rx="2" fill="#4e9775" />
      <rect x="21" y="4" width="7" height="23" rx="2" fill="#27684e" />
    </>
  ),
};

export type HeaderArtName = keyof typeof illustrations;

export function HeaderArt({ name }: { name: HeaderArtName }) {
  return <svg aria-hidden="true" viewBox="0 0 32 32" width={name === "logo" ? 44 : 25} height={name === "logo" ? 44 : 25}>{illustrations[name]}</svg>;
}
