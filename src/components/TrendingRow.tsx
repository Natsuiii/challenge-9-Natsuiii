'use client';

import { useRef } from 'react';
import { Movie } from '@/lib/tmdb';
import MovieCard from './MovieCard';

export default function TrendingRow({ items }: { items: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' });

  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="mb-4 text-xl md:text-2xl font-semibold">Trending Now</h2>

      <div className="relative">
        <div
          ref={ref}
          className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-2"
        >
          {items.map(m => (
            <div key={m.id} className="snap-start">
              <MovieCard movie={m} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollBy(-500)}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur p-2 hover:bg-black/60"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={() => scrollBy(500)}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur p-2 hover:bg-black/60"
          aria-label="Next"
        >
          ›
        </button>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0b0f19] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0b0f19] to-transparent" />
      </div>
    </section>
  );
}
