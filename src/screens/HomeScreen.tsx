import React, { useEffect, useState, useRef } from 'react';
import { Movie, TheatreSchedule } from '../types';
import { MOVIES, UPCOMING_MOVIES, THEATRES, HOME_GENRE_FILTERS } from '../data/mockData';
import { DbMovie, getMovies } from '../api';
import { AllMoviesModal } from '../components/AllMoviesModal';

function normalizedTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function makePoster(title: string, genre: string) {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeGenre = genre.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111827"/><stop offset="1" stop-color="#422006"/></linearGradient></defs><rect width="600" height="900" fill="url(#g)"/><circle cx="470" cy="180" r="170" fill="#f59e0b" opacity=".12"/><text x="42" y="675" fill="#fbbf24" font-size="24" font-family="Arial" letter-spacing="5">CINEPASS</text><text x="42" y="735" fill="#ffffff" font-size="42" font-weight="700" font-family="Arial">${safeTitle}</text><text x="42" y="785" fill="#d1d5db" font-size="24" font-family="Arial">${safeGenre}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function mapDatabaseMovie(row: DbMovie): Movie {
  const key = normalizedTitle(row.title);
  const metadata = MOVIES.find((movie) => {
    const mockKey = normalizedTitle(movie.title);
    return mockKey === key || mockKey.includes(key) || key.includes(mockKey);
  });
  const genre = row.genre || 'Drama';
  const runtimeHours = Math.floor(Number(row.duration || 0) / 60);
  const runtimeMinutes = Number(row.duration || 0) % 60;
  const generatedPoster = makePoster(row.title, genre);
  return {
    ...(metadata || {} as Movie),
    id: String(row.id),
    title: row.title,
    posterUrl: metadata?.posterUrl || generatedPoster,
    bannerUrl: metadata?.bannerUrl || metadata?.posterUrl || generatedPoster,
    rating: metadata?.rating ?? 0,
    ageRating: metadata?.ageRating || 'NR',
    runtime: `${runtimeHours}h ${String(runtimeMinutes).padStart(2, '0')}m`,
    genres: [genre],
    formats: metadata?.formats?.length ? metadata.formats : ['Standard 2D'],
    synopsis: metadata?.synopsis || `${row.title} is a ${row.language || 'feature'} film in the ${genre} genre.`,
    releaseDate: row.releaseDate || undefined,
    isUpcoming: false,
    nowShowingSlots: [],
  };
}

interface HomeScreenProps {
  onBookMovie: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  onSelectTheatre: (theatre: TheatreSchedule, movie?: Movie) => void;
  onOpenUpgradePerks: () => void;
  onSetReminder: (movieTitle: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onBookMovie,
  onWatchTrailer,
  onSelectTheatre,
  onOpenUpgradePerks,
  onSetReminder,
}) => {
  const [movies, setMovies] = useState<Movie[]>(MOVIES);
  const [moviesError, setMoviesError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    getMovies()
      .then((data) => {
        if (!cancelled) {
          setMovies(data.map(mapDatabaseMovie));
          setMoviesError(null);
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load movies from MySQL:', error);
        if (!cancelled) setMoviesError(error instanceof Error ? error.message : 'Backend unavailable');
      });
    return () => { cancelled = true; };
  }, []);
  const databaseDefaultMovie = movies.find((movie) => /^\d+$/.test(movie.id)) || { ...MOVIES[0], id: '1', title: 'Inception', runtime: '2h 28m', genres: ['Sci-Fi'] };
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [remindedMovies, setRemindedMovies] = useState<Record<string, boolean>>({});
  const [isSeeAllOpen, setIsSeeAllOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  const scrollRail = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const distance = x - startX.current;
    if (Math.abs(distance) > 5) {
      hasDragged.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - distance;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      // If user scrolls vertically with mouse wheel, translate into horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // Spotlight movie rotation: Dune: Part Two is the hero #0
  const spotlightMovies = movies.filter((movie) => !movie.isUpcoming).slice(0, 3);
  const currentSpotlight = spotlightMovies[spotlightIndex] || movies[0] || MOVIES[0];

  // Filter Now Showing movies based on search and filters
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (movie.formats && movie.formats.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (selectedFormat !== 'all') {
      if (selectedFormat === 'IMAX 70mm' && !movie.formats.includes('IMAX 70mm')) return false;
      if (selectedFormat === 'Dolby Cinema' && !movie.formats.includes('Dolby Cinema')) return false;
      if (selectedFormat === '4DX Live' && !movie.formats.includes('4DX Live')) return false;
      if (selectedFormat === 'RealD 3D' && !movie.formats.includes('RealD 3D')) return false;
    }

    if (selectedGenre && !movie.genres.includes(selectedGenre)) {
      return false;
    }

    return true;
  });

  const handleToggleReminder = (id: string, title: string) => {
    setRemindedMovies((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        onSetReminder(title);
      }
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <div className="pt-16 pb-24 space-y-6">
      {moviesError && <p className="mx-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">Backend not connected — showing temporary sample movies. {moviesError}</p>}
      {/* Live Search & Interactive Filter Dock */}
      <section className="space-y-3 px-4 pt-2">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]" data-icon="search">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 text-sm font-medium pl-11 pr-10 py-2.5 rounded-xl border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-all duration-200"
            placeholder="Search films, actors, premium IMAX..."
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-on-surface-variant hover:text-primary p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          ) : (
            <button
              type="button"
              aria-label="Voice Search"
              onClick={() => setSearchQuery('IMAX')}
              className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="mic">
                mic
              </span>
            </button>
          )}
        </div>

        {/* Format & Genre Horizontal Scroll Filter Rails */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* IMAX 70mm */}
          <button
            onClick={() => setSelectedFormat(selectedFormat === 'IMAX 70mm' ? 'all' : 'IMAX 70mm')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${selectedFormat === 'IMAX 70mm'
                ? 'bg-primary-container text-on-primary-container glow-amber'
                : 'bg-surface-container-high border border-white/10 text-on-surface hover:text-primary hover:border-primary/40'
              }`}
          >
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
            IMAX 70mm
          </button>

          {/* Dolby Cinema */}
          <button
            onClick={() => setSelectedFormat(selectedFormat === 'Dolby Cinema' ? 'all' : 'Dolby Cinema')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${selectedFormat === 'Dolby Cinema'
                ? 'bg-primary-container text-on-primary-container font-bold glow-amber border-transparent'
                : 'bg-surface-container-high border-white/10 text-on-surface hover:text-primary hover:border-primary/40'
              }`}
          >
            Dolby Cinema
          </button>

          {/* 4DX Live */}
          <button
            onClick={() => setSelectedFormat(selectedFormat === '4DX Live' ? 'all' : '4DX Live')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${selectedFormat === '4DX Live'
                ? 'bg-primary-container text-on-primary-container font-bold glow-amber border-transparent'
                : 'bg-surface-container-high border-white/10 text-on-surface hover:text-primary hover:border-primary/40'
              }`}
          >
            4DX Live
          </button>

          {/* RealD 3D */}
          <button
            onClick={() => setSelectedFormat(selectedFormat === 'RealD 3D' ? 'all' : 'RealD 3D')}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${selectedFormat === 'RealD 3D'
                ? 'bg-primary-container text-on-primary-container font-bold glow-amber border-transparent'
                : 'bg-surface-container-high border-white/10 text-on-surface hover:text-primary hover:border-primary/40'
              }`}
          >
            RealD 3D
          </button>

          <div className="h-4 w-[1px] bg-white/10 flex-shrink-0" />

          {/* Genre Filters */}
          {HOME_GENRE_FILTERS.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer active:scale-95 ${selectedGenre === genre
                  ? 'bg-primary/20 text-primary border-primary/40 font-bold'
                  : 'bg-surface-container border-white/5 text-on-surface-variant hover:text-primary'
                }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Hero Featured Movie Spotlight Carousel Item */}
      <section className="relative px-4">
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-surface-container-low shadow-2xl">
          {/* Backdrop Banner Artwork */}
          <div className="relative h-[380px] w-full bg-surface-container-lowest">
            <img
              src={currentSpotlight.bannerUrl}
              alt={currentSpotlight.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {/* Atmospheric Dark Scrim and Luminescent Bottom Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/80 via-transparent to-surface-container-lowest/40" />

            {/* Floating Top Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              <span className="bg-secondary-container/90 backdrop-blur-md text-on-secondary px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 glow-crimson uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                Spotlight
              </span>
              <span className="bg-surface-container-lowest/80 backdrop-blur-md border border-white/10 text-primary-fixed px-2 py-0.5 rounded-md text-[10px] font-semibold">
                {currentSpotlight.spotlightTag || 'IMAX Experience'}
              </span>
            </div>

            {/* Content Overlay Docked to Bottom */}
            <div className="absolute bottom-0 inset-x-0 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest/80 text-on-surface font-semibold text-[10px]">
                  {currentSpotlight.ageRating}
                </span>
                <span>•</span>
                <span>{currentSpotlight.runtime}</span>
                <span>•</span>
                <div className="flex items-center text-primary-fixed font-bold gap-0.5">
                  <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>{currentSpotlight.imdbRating || `${currentSpotlight.rating} IMDb`}</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight drop-shadow-md">
                  {currentSpotlight.title}
                </h1>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                  {currentSpotlight.synopsis}
                </p>
              </div>

              {/* Action CTAs */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {/* Book Now Primary Action */}
                <button
                  type="button"
                  onClick={() => onBookMovie(currentSpotlight)}
                  className="bg-primary-container text-on-primary-container text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 glow-amber active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    confirmation_number
                  </span>
                  Book Now
                </button>

                {/* Watch Trailer Secondary Glass CTA */}
                <button
                  type="button"
                  onClick={() => onWatchTrailer(currentSpotlight)}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-on-surface text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">play_circle</span>
                  Trailer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-2.5">
          {spotlightMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSpotlightIndex(idx)}
              className={`transition-all ${spotlightIndex === idx
                  ? 'w-5 h-1.5 rounded-full bg-primary-container glow-amber'
                  : 'w-1.5 h-1.5 rounded-full bg-surface-variant'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Now Showing Horizontal Rail */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary-container rounded-full" />
            <h2 className="text-lg font-headline font-bold text-on-surface">Now Showing</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Scroll Navigation Chevrons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollRail(-200)}
                aria-label="Scroll left"
                className="w-7 h-7 rounded-full bg-surface-container-high border border-white/5 hover:border-primary/40 text-on-surface hover:text-primary flex items-center justify-center transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => scrollRail(200)}
                aria-label="Scroll right"
                className="w-7 h-7 rounded-full bg-surface-container-high border border-white/5 hover:border-primary/40 text-on-surface hover:text-primary flex items-center justify-center transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* See All Action */}
            <button
              type="button"
              onClick={() => setIsSeeAllOpen(true)}
              className="text-xs font-semibold text-primary flex items-center hover:underline pl-1 active:scale-95 transition-transform"
            >
              See all
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Horizontal Movie Poster Cards with Drag and Wheel Support */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1 cursor-grab active:cursor-grabbing select-none scroll-smooth"
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-40 bg-surface-container-low rounded-xl border border-white/5 overflow-hidden group hover:border-primary/40 transition-all flex flex-col cursor-pointer"
              onClick={() => {
                if (!hasDragged.current) {
                  onBookMovie(movie);
                }
              }}
            >
              <div className="relative h-56 w-full overflow-hidden bg-surface-container-highest pointer-events-none">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  draggable={false}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-surface-container-lowest/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-primary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  {movie.rating}
                </div>
                <span className="absolute bottom-2 left-2 bg-surface-container-high/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-on-surface tracking-wider uppercase">
                  {movie.formats[0] || 'IMAX 3D'}
                </span>
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2 pointer-events-none">
                <div>
                  <h3 className="text-sm font-bold text-on-surface truncate font-headline">{movie.title}</h3>
                  <p className="text-xs text-on-surface-variant truncate">{movie.genres.join(' • ')}</p>
                </div>

                {/* Showtime Tags */}
                <div className="flex items-center gap-1 overflow-hidden">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-primary/20">
                    {movie.nowShowingSlots?.[0] || '18:40'}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                    {movie.nowShowingSlots?.[1] || '21:15'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Theatres Quick-Switch Grid */}
      <section className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary-container rounded-full" />
            <h2 className="text-lg font-headline font-bold text-on-surface">Nearby Theatres</h2>
          </div>
          <span className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-primary">near_me</span>
            Auto-detected
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Cinema Card 1 */}
          <div
            onClick={() => onSelectTheatre(THEATRES[0], databaseDefaultMovie)}
            className="bg-surface-container-low p-3.5 rounded-xl border border-white/5 flex items-center justify-between hover:border-primary/40 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                <span className="material-symbols-outlined text-[22px]">theater_comedy</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface font-headline group-hover:text-primary transition-colors">
                  Starlight IMAX Cinema
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                  <span className="text-primary font-medium">1.8 km</span>
                  <span>•</span>
                  <span>Grand Boulevard #402</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                Laser IMAX
              </span>
            </div>
          </div>

          {/* Cinema Card 2 */}
          <div
            onClick={() => onSelectTheatre(THEATRES[1], databaseDefaultMovie)}
            className="bg-surface-container-low p-3.5 rounded-xl border border-white/5 flex items-center justify-between hover:border-primary/40 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                <span className="material-symbols-outlined text-[22px]">local_movies</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface font-headline group-hover:text-primary transition-colors">
                  Grand Dolby Cineplex
                </h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                  <span className="text-primary font-medium">3.2 km</span>
                  <span>•</span>
                  <span>Riverfront Plaza Mall</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant border border-white/5">
                Dolby Atmos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section with Remind Me Chips */}
      <section className="space-y-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-secondary-container rounded-full" />
            <h2 className="text-lg font-headline font-bold text-on-surface">Coming Soon</h2>
          </div>
          <span className="text-xs text-on-surface-variant">Tickets opening soon</span>
        </div>

        <div className="space-y-2.5">
          {UPCOMING_MOVIES.map((movie) => {
            const isReminded = remindedMovies[movie.id];
            return (
              <div
                key={movie.id}
                className="bg-surface-container-low rounded-xl border border-white/5 p-3 flex items-center gap-3"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-16 h-20 rounded-lg object-cover flex-shrink-0 border border-white/5"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                    {movie.upcomingReleaseDate}
                  </span>
                  <h3 className="text-sm font-bold text-on-surface truncate font-headline">{movie.title}</h3>
                  <p className="text-xs text-on-surface-variant truncate">{movie.genres.join(' • ')}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-on-surface-variant/70">
                      Format: {movie.formats.join(' & ')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleReminder(movie.id, movie.title)}
                  className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all active:scale-95 ${isReminded
                      ? 'bg-primary/20 text-primary border-primary/40'
                      : 'bg-surface-container-high hover:bg-surface-variant text-on-surface border-white/10'
                    }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    {isReminded ? 'notifications_active' : 'notifications'}
                  </span>
                  <span>{isReminded ? 'Reminded' : 'Remind'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exclusive Perks Banner (Bento Micro Card) */}
      <section className="px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-low p-4 border border-outline-variant/30 flex items-center justify-between">
          <div className="space-y-1 z-10 max-w-[70%]">
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              CinePass Elite Pass
            </span>
            <h3 className="text-base font-bold font-headline text-on-surface">Unlimited IMAX Screenings</h3>
            <p className="text-xs text-on-surface-variant">Get 20% off concessions and priority lounge entry.</p>
          </div>
          <button
            type="button"
            onClick={onOpenUpgradePerks}
            className="z-10 bg-primary-container text-on-primary-container px-3 py-2 rounded-xl text-xs font-bold glow-amber active:scale-95 transition-transform flex-shrink-0"
          >
            Upgrade
          </button>
          <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* All Movies Modal for See All */}
      <AllMoviesModal
        movies={movies}
        isOpen={isSeeAllOpen}
        onClose={() => setIsSeeAllOpen(false)}
        onBookMovie={onBookMovie}
      />
    </div>
  );
};
