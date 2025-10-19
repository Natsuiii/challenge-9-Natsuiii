import SearchClient from '@/components/SearchClient';

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? '';
  return (
    <>
      <main>
        <SearchClient key={q} initialQuery={q} />
      </main>
    </>
  );
}
