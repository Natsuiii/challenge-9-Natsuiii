import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrendingRow from '@/components/TrendingRow';
import NewReleases from '@/components/NewReleases';
import { getTrendingMovies, getNowPlayingMovies } from '@/lib/tmdb';

export default async function HomePage() {
  const trending = await getTrendingMovies();
  const nowPlaying = await getNowPlayingMovies(1);

  const featured = trending[0] ?? {
    id: 0,
    title: 'Featured Movie',
    overview: '',
    backdrop_path: null,
  };

  return (
    <>
      <main>
        <Hero movie={featured} />

        <div className="space-y-10 pb-16">
          <TrendingRow items={trending.slice(1, 13)} />

          <NewReleases initial={nowPlaying.results ?? []} initialPage={nowPlaying.page ?? 1} />
        </div>
      </main>
    </>
  );
}
