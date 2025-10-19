'use client';

import { useState } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/lib/tmdb';

type Props = {
  initial: Movie[];
  initialPage: number;
};

export default function NewReleases({ initial, initialPage }: Props) {
  const [items, setItems] = useState<Movie[]>(initial);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tmdb/new-releases?page=${page + 1}`);
      const data = await res.json();
      setItems(prev => [...prev, ...(data.results || [])]);
      setPage(data.page || page + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="mb-4 text-xl md:text-2xl font-semibold">New Release</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center sm:justify-items-start">
        {items.map(m => (
          <MovieCard key={`${m.id}-${m.poster_path}`} movie={m} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={loadMore}
          disabled={loading}
          className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-6 py-2.5 text-sm font-medium hover:bg-white/15 disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Load More'}
        </button>
      </div>
    </section>
  );
}
