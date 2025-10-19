export type Movie = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
};

const BASE = 'https://api.themoviedb.org/3';

function requiredKey() {
  // Pakai salah satu, biar fleksibel (server route bisa TMDB_API_KEY)
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) throw new Error('Missing TMDB_API_KEY or NEXT_PUBLIC_TMDB_API_KEY');
  return key;
}

async function tmdb(path: string, params: Record<string, string | number> = {}) {
  const apiKey = requiredKey();
  const search = new URLSearchParams({
    api_key: apiKey,
    language: 'en-US',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  const res = await fetch(`${BASE}${path}?${search.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await tmdb('/trending/movie/week');
  return data.results ?? [];
}

export async function getNowPlayingMovies(page = 1): Promise<{results: Movie[], page: number, total_pages: number}> {
  const data = await tmdb('/movie/now_playing', { page });
  return data;
}

export type ImgSize =
  | 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w342'
  | 'w500' | 'w780' | 'w1280' | 'h632' | 'original';

export function imgUrl(
  path?: string | null,
  size: ImgSize = 'w780'   // default aman untuk backdrop
) {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getTitle(m: Movie) {
  return m.title || m.name || 'Untitled';
}

export type Genre = { id: number; name: string };
export type MovieDetail = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  adult?: boolean;
  genres?: Genre[];
};

export type Video = {
  key: string;
  name: string;
  site: 'YouTube' | 'Vimeo' | string;
  type: 'Trailer' | string;
  official?: boolean;
};

export type Credit = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
};

export async function getMovieDetail(id: string): Promise<MovieDetail> {
  return tmdb(`/movie/${id}`);
}

export async function getMovieVideos(id: string): Promise<Video[]> {
  const data = await tmdb(`/movie/${id}/videos`);
  return data.results ?? [];
}

export async function getMovieCredits(id: string): Promise<{ cast: Credit[] }> {
  const data = await tmdb(`/movie/${id}/credits`);
  return { cast: data.cast ?? [] };
}

// pick a good YouTube trailer if exists
export function pickTrailer(videos: Video[]): Video | null {
  const yt = videos.filter(v => v.site === 'YouTube');
  return (
    yt.find(v => v.type === 'Trailer' && v.official) ||
    yt.find(v => v.type === 'Trailer') ||
    yt[0] ||
    null
  );
}