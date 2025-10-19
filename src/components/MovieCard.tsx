import Image from 'next/image';
import { Movie, getTitle, imgUrl } from '@/lib/tmdb';
import { Star } from 'lucide-react';
import Link from 'next/link';

export default function MovieCard({ movie }: { movie: Movie }) {
  const title = getTitle(movie);
  const poster = imgUrl(movie.poster_path, 'w500') || '/placeholder-poster.jpg';
  const rating =
    typeof movie.vote_average === 'number'
      ? Math.round(movie.vote_average * 10) / 10
      : null;

  return (
    <div className="w-[150px] md:w-[180px] flex-shrink-0">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <Image src={poster} alt={title} fill sizes="180px" className="object-cover" />
        </div>

        <p className="mt-2 truncate text-sm text-white/90">{title}</p>

        {rating !== null && (
          <div className="mt-1 flex items-center gap-1 text-xs text-white/70">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              className="text-yellow-400"
              fill="currentColor"
            >
              <Star className='h-4 w-4 text-yellow-400 fill-yellow-400' />
            </svg>
            <span>{rating} / 10</span>
          </div>
        )}
      </Link>
    </div>
  );
}
