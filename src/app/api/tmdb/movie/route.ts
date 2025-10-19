// src/app/api/tmdb/movie/route.ts  (atau app/api/tmdb/movie/route.ts)
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // hindari cache di dev
// export const revalidate = 0; // alternatif

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
  if (!id) {
    return NextResponse.json({ error: 'missing id' }, { status: 400 });
  }

  const key =
    process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'Missing TMDB_API_KEY/NEXT_PUBLIC_TMDB_API_KEY' },
      { status: 500 }
    );
  }

  const base = 'https://api.themoviedb.org/3';
  const detailUrl = `${base}/movie/${id}?api_key=${key}&language=en-US`;
  const videoUrl = `${base}/movie/${id}/videos?api_key=${key}&language=en-US`;

  const [detailRes, videosRes] = await Promise.all([
    fetch(detailUrl, { next: { revalidate: 60 } }),
    fetch(videoUrl, { next: { revalidate: 60 } }),
  ]);

  if (!detailRes.ok) {
    const t = await detailRes.text();
    return NextResponse.json({ error: t }, { status: detailRes.status });
  }

  const detail = await detailRes.json();
  const videos = videosRes.ok ? await videosRes.json() : { results: [] };
  const trailerKey = pickTrailer(videos.results || []);

  return NextResponse.json({ detail, trailerKey });
}
