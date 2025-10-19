import { NextResponse } from 'next/server';

function pickTrailer(videos: any[]): string | null {
  const yt = (videos || []).filter((v: any) => v.site === 'YouTube');
  const best =
    yt.find((v: any) => v.type === 'Trailer' && v.official) ||
    yt.find((v: any) => v.type === 'Trailer') ||
    yt[0];
  return best ? best.key : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) return NextResponse.json({ error: 'Missing TMDB_API_KEY' }, { status: 500 });

  const base = 'https://api.themoviedb.org/3';
  const qs = (extra = '') =>
    `api_key=${key}&language=en-US${extra ? `&${extra}` : ''}`;

  const [detailRes, videosRes] = await Promise.all([
    fetch(`${base}/movie/${id}?${qs()}`, { next: { revalidate: 60 } }),
    fetch(`${base}/movie/${id}/videos?${qs()}`, { next: { revalidate: 60 } }),
  ]);

  if (!detailRes.ok) return NextResponse.json({ error: 'TMDB detail error' }, { status: detailRes.status });

  const detail = await detailRes.json();
  const videos = videosRes.ok ? await videosRes.json() : { results: [] };

  return NextResponse.json({
    detail,
    trailerKey: pickTrailer(videos.results || []),
  });
}
