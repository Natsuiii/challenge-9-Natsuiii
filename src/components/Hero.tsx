'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie, getTitle, imgUrl } from '@/lib/tmdb';

export default function Hero({ movie }: { movie: Movie }) {
  const title = getTitle(movie);
  const desc = movie.overview ?? '';
  const bg = imgUrl(movie.backdrop_path, 'original') || '/placeholder-hero.jpg';

  function onWatch() {
    alert('Play trailer (stub)');
  }

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh]">
      <Image src={bg} alt={title} fill priority className="object-cover" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19]/95 via-[#0b0f19]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 pt-44 pb-16 md:pt-52">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="mt-5 text-white/85 leading-relaxed">
            {desc.length > 240 ? desc.slice(0, 237) + '…' : desc}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={onWatch}
              className="group inline-flex items-center rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold hover:bg-red-500 transition"
            >
              <span className="mr-2 grid h-6 w-6 place-items-center rounded-full bg-white/20 group-hover:bg-white/30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch Trailer
            </button>

            <Link
              href={`/movie/${movie.id}`}
              className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-5 py-2.5 text-sm font-medium text-white/95 hover:bg-white/15 transition"
            >
              See Detail
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
