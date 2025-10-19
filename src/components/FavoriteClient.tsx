"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clapperboard, Heart, Star } from "lucide-react";

type FavItem = {
  id: number;
  title: string;
  overview: string;
  poster: string | null;
  rating: number | null;
  trailerKey: string | null;
};

const FAV_KEY = "favorites";

export default function FavoritesClient() {
  const [items, setItems] = useState<FavItem[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function readFavIds(): number[] {
    const raw = localStorage.getItem("favorites");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((x) => Number(x)).filter((n) => Number.isFinite(n));
      }
    } catch {
      return raw
        .replace(/[\[\]\s]/g, "")
        .split(",")
        .map((n) => Number(n))
        .filter((n) => Number.isFinite(n));
    }
    return [];
  }

  useEffect(() => {
    const ids = readFavIds();
    if (ids.length === 0) {
      setItems([]);
      return;
    }

    (async () => {
      const results = await Promise.allSettled(
        ids.map(async (id) => {
          // coba lewat API route (aman)
          let res = await fetch(`/api/tmdb/movie?id=${id}`);
          if (!res.ok) throw new Error(`Fail ${id} ${res.status}`);
          const data = await res.json();
          const d = data.detail;
          if (!d) throw new Error(`No detail for ${id}`);

          return {
            id: d.id,
            title: d.title || d.name || "Untitled",
            overview: d.overview || "",
            poster: d.poster_path
              ? `https://image.tmdb.org/t/p/w342${d.poster_path}`
              : null,
            rating:
              typeof d.vote_average === "number"
                ? Math.round(d.vote_average * 10) / 10
                : null,
            trailerKey: data.trailerKey || null,
          } as FavItem;
        })
      );

      const ok = results
        .filter(
          (r): r is PromiseFulfilledResult<FavItem> => r.status === "fulfilled"
        )
        .map((r) => r.value);

      setItems(ok); 
    })().catch((e) => {
      console.error(e);
      setItems([]);
    });
  }, []);

  function remove(id: number) {
    const raw = localStorage.getItem(FAV_KEY);
    const ids: number[] = raw ? JSON.parse(raw) : [];
    const next = ids.filter((x) => x !== id);
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setItems((prev) => (prev ? prev.filter((x) => x.id !== id) : prev));
    setToast("Removed from Favorites");
    setTimeout(() => setToast(null), 1500);
  }

  if (items === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        <div className="mt-6 text-white/70">Loading…</div>
      </div>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-16">
      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-sm font-medium">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-semibold">Favorites</h1>

      {isEmpty ? (
        <div className="mt-16 grid place-items-center text-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-10 max-w-md">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-xl bg-white/10">
              <Clapperboard className="h-8 w-8 text-white/70" />
            </div>
            <p className="mt-5 font-semibold">Data Empty</p>
            <p className="mt-1 text-sm text-white/70">
              You don&apos;t have a favorite movie yet.
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
          {items.map((m) => (
            <li
              key={m.id}
              className="border-b border-white/10 pb-8 last:border-b-0"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="relative h-[128px] w-[96px] overflow-hidden rounded-xl border border-white/10 bg-white/5">
                    {m.poster ? (
                      <Image
                        src={m.poster}
                        alt={m.title}
                        fill
                        className="object-cover"
                      />
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
                      <Link
                        href={`/movie/${m.id}`}
                        className="text-base font-semibold hover:underline"
                      >
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
                      onClick={() => remove(m.id)}
                      aria-label="Remove from favorites"
                      className="rounded-full bg-white/10 p-2 hover:bg-white/15 transition"
                      title="Remove"
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-red-500 fill-red-500"
                      >
                        <path d="M12 21s-1-.45-2-1.35C6 16.36 2 13.28 2 9.5A4.5 4.5 0 0 1 6.5 5 5.6 5.6 0 0 1 12 7a5.6 5.6 0 0 1 5.5-2 4.5 4.5 0 0 1 4.5 4.5c0 3.78-4 6.86-8 10.15-1 .9-2 1.35-2 1.35z" />
                      </svg>
                    </button>
                  </div>

                  {m.overview && (
                    <p className="mt-2 text-sm text-white/75 line-clamp-2">
                      {m.overview}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    {m.trailerKey && (
                      <a
                        href={`https://www.youtube.com/watch?v=${m.trailerKey}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold hover:bg-red-500 transition"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch Trailer
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
