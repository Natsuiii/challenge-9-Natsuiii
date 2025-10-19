'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Clapperboard, Star, Heart } from 'lucide-react';

type Row = {
  id: number;
  title: string;
  overview: string;
  poster: string | null;
  rating: number | null;
  trailerKey: string | null;
};

const FAV_KEY = 'favorites';

function readFavIds(): number[] {
  const raw = localStorage.getItem(FAV_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(Number).filter(Number.isFinite);
  } catch {
    return raw
      .replace(/[\[\]\s]/g, '')
      .split(',')
      .map(Number)
      .filter(Number.isFinite);
  }
  return [];
}

function setFavIds(ids: number[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify(ids));
}

export default function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [q, setQ] = useState(initialQuery || '');
  const [rows, setRows] = useState<Row[] | null>(null); 
  const [favIds, setFavIdsState] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => setFavIdsState(readFavIds()), []);

  useEffect(() => {
    if (!q.trim()) {
      setRows([]);
      return;
    }

    setRows(null);
    (async () => {
      const r = await fetch(`/api/tmdb/search?query=${encodeURIComponent(q)}`);
      const data = await r.json();
      const baseRows: Row[] = (data.results || []).map((m: any) => ({
        id: m.id,
        title: m.title || m.name || 'Untitled',
        overview: m.overview || '',
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
        rating: typeof m.vote_average === 'number' ? Math.round(m.vote_average * 10) / 10 : null,
        trailerKey: null,
      }));

      const withTrailers = await Promise.allSettled(
        baseRows.map(async (row) => {
          const res = await fetch(`/api/tmdb/movie?id=${row.id}`);
          if (!res.ok) return row;
          const d = await res.json();
          return { ...row, trailerKey: d.trailerKey || null };
        })
      );

      setRows(
        withTrailers.map((r, i) => (r.status === 'fulfilled' ? r.value : baseRows[i]))
      );
    })().catch(() => setRows([]));
  }, [q]);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const nq = sp.get('q') || '';
    setQ(nq);
  }, []);

  const isEmpty = rows !== null && rows.length === 0;

  function toggleFav(id: number) {
    const has = favIds.includes(id);
    const next = has ? favIds.filter((x) => x !== id) : [...favIds, id];
    setFavIds(next);
    setFavIdsState(next);
    setToast(has ? 'Removed from Favorites' : 'Success Add to Favorites');
    setTimeout(() => setToast(null), 1400);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-16">
      {toast && (
        <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-sm font-medium">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-semibold">Search</h1>

      {rows === null ? (
        <div className="mt-6 text-white/70">Loading…</div>
      ) : isEmpty ? (
        <div className="mt-16 grid place-items-center text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-10 max-w-md">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-xl bg-white/10">
              <Clapperboard className="h-8 w-8 text-white/70" />
            </div>
            <p className="mt-5 font-semibold">No results</p>
            <p className="mt-1 text-sm text-white/70">
              We couldn&apos;t find anything for “{q}”.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-500 transition"
            >
              Explore Movie
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-8">
          {rows!.map((m) => {
            const isFav = favIds.includes(m.id);
            return (
              <li key={m.id} className="border-b border-white/10 pb-8 last:border-b-0">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="relative h-[128px] w-[96px] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      {m.poster ? (
                        <Image src={m.poster} alt={m.title} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-white/60">
                          No Poster
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/movie/${m.id}`} className="text-base font-semibold hover:underline">
                          {m.title}
                        </Link>
                        {m.rating !== null && (
                          <div className="mt-1 flex items-center gap-1 text-sm text-white/80">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>{m.rating}/10</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleFav(m.id)}
                        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        className="rounded-full bg-white/10 p-2 hover:bg-white/15 transition"
                        title={isFav ? 'Remove' : 'Add to favorites'}
                      >
                        <Heart className={`h-4 w-4 ${isFav ? 'text-red-500 fill-red-500' : ''}`} />
                      </button>
                    </div>

                    {m.overview && (
                      <p className="mt-2 text-sm text-white/75 line-clamp-2">{m.overview}</p>
                    )}

                    <div className="mt-3 flex items-center gap-3">
                      {m.trailerKey && (
                        <a
                          href={`https://www.youtube.com/watch?v=${m.trailerKey}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold hover:bg-red-500 transition"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Watch Trailer
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
