import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('query') || url.searchParams.get('q') || '';
  const page = Number(url.searchParams.get('page') || '1');

  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) return NextResponse.json({ error: 'Missing TMDB_API_KEY' }, { status: 500 });

  if (!q.trim()) return NextResponse.json({ results: [], page: 1, total_pages: 1 });

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&include_adult=false&page=${page}&query=${encodeURIComponent(
      q
    )}`,
    { next: { revalidate: 30 } }
  );
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });

  return NextResponse.json({ results: data.results ?? [], page: data.page ?? 1, total_pages: data.total_pages ?? 1 });
}
