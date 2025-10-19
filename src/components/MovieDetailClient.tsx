"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Heart, Play, Star } from "lucide-react";
import { MovieDetail, imgUrl, getTitle, Credit } from "@/lib/tmdb";

type Props = {
  detail: MovieDetail;
  trailerKey: string | null;
  cast: Credit[];
};

const FAV_KEY = "favorites";

function useFavorite(id: number) {
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem(FAV_KEY);
    const list: number[] = raw ? JSON.parse(raw) : [];
    setIsFav(list.includes(id));
  }, [id]);
  function toggle() {
    const raw = localStorage.getItem(FAV_KEY);
    const list: number[] = raw ? JSON.parse(raw) : [];
    const next = list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setIsFav(next.includes(id));
    return next.includes(id);
  }
  return { isFav, toggle };
}

export default function MovieDetailClient({ detail, trailerKey, cast }: Props) {
  const title = getTitle(detail);
  const bg = imgUrl(detail.backdrop_path, "original");
  const poster = imgUrl(detail.poster_path, "w342");
  const date = detail.release_date ? new Date(detail.release_date) : null;
  const rating = detail.vote_average
    ? Math.round(detail.vote_average * 10) / 10
    : null;
  const mainGenre = detail.genres?.[0]?.name ?? "-";
  const ageLimit = detail.adult ? "18" : "13";

  const { isFav, toggle } = useFavorite(detail.id);

  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  }
  const onToggleFav = () => {
    const nowFav = toggle();
    showToast(nowFav ? "Success Add to Favorites" : "Removed from Favorites");
  };

  const trailerUrl = useMemo(
    () => (trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : null),
    [trailerKey]
  );

  return (
    <section className="relative">
      <div className="relative h-[100vh]">
        {bg && (
          <Image src={bg} alt={title} fill priority className="object-cover" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19]/85 via-[#0b0f19]/50 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b0f19] to-transparent" />

        {toast && (
          <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2">
            <div className="rounded-full bg-white/15 backdrop-blur px-4 py-2 text-sm font-medium">
              {toast}
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-end pt-[600px] max-[525px]:pt-[800px]">
          <div className="mx-auto my-[100px] max-w-6xl w-full px-4 pb-8">
            <div className="flex flex-wrap items-start gap-6 md:gap-8">
              <div className="shrink-0">
                <div className="relative h-[300px] w-[210px] overflow-hidden rounded-xl ring-1 ring-white/20 bg-white/5 shadow-lg">
                  {poster && (
                    <Image
                      src={poster}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-[260px] pb-1">
                <h1 className="text-3xl md:text-4xl font-extrabold break-words">{title}</h1>

                {date && (
                  <div className="mt-2 flex items-center gap-2 text-white/80">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {date.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {trailerUrl && (
                    <a
                      href={trailerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 transition"
                    >
                      <Play className="h-4 w-4" />
                      Watch Trailer
                    </a>
                  )}
                  <button
                    onClick={onToggleFav}
                    aria-label="Toggle favorite"
                    className="rounded-full bg-white/10 px-3 py-2 hover:bg-white/15 transition"
                    title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFav ? "text-red-500 fill-red-500" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-black/40 backdrop-blur ring-1 ring-white/10 px-4 py-3">
                    <div className="text-sm text-white/70">Rating</div>
                    <div className="mt-1 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <div className="font-semibold">{rating ?? "-"}/10</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/40 backdrop-blur ring-1 ring-white/10 px-4 py-3">
                    <div className="text-sm text-white/70">Genre</div>
                    <div className="mt-1 font-semibold">{mainGenre}</div>
                  </div>
                  <div className="rounded-xl bg-black/40 backdrop-blur ring-1 ring-white/10 px-4 py-3">
                    <div className="text-sm text-white/70">Age Limit</div>
                    <div className="mt-1 font-semibold">{ageLimit}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16">
        {detail.overview && (
          <div className="mt-2">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-2 text-white/80 leading-relaxed">
              {detail.overview}
            </p>
          </div>
        )}

        {cast?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Cast & Crew</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((c) => {
                const p = imgUrl(c.profile_path, "w185");
                return (
                  <div
                    key={c.id}
                    className="rounded-xl ring-1 ring-white/10 bg-white/5 p-3"
                  >
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-white/5">
                      {p ? (
                        <Image
                          src={p}
                          alt={c.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-white/50">
                          No Photo
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-sm font-semibold line-clamp-1">
                      {c.name}
                    </div>
                    {c.character && (
                      <div className="text-xs text-white/70 line-clamp-1">
                        {c.character}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
