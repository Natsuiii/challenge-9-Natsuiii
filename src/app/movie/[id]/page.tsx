import MovieDetailClient from '@/components/MovieDetailClient';
import { getMovieDetail, getMovieVideos, getMovieCredits, pickTrailer } from '@/lib/tmdb';

type Params = { params: { id: string } };

export default async function MovieDetailPage({ params }: Params) {
  const id = params.id;
  const [detail, videos, credits] = await Promise.all([
    getMovieDetail(id),
    getMovieVideos(id),
    getMovieCredits(id),
  ]);
  const trailer = pickTrailer(videos);

  return (
    <>
      <main>
        <MovieDetailClient
          detail={detail}
          trailerKey={trailer?.site === 'YouTube' ? trailer.key : null}
          cast={credits.cast.slice(0, 6)}  // cukup 6 orang seperti di figma
        />
      </main>
    </>
  );
}
