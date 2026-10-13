import React, { useState } from 'react';
import { Movie } from '../types';

interface AllMoviesModalProps {
  movies: Movie[];
  isOpen: boolean;
  onClose: () => void;
  onBookMovie: (movie: Movie) => void;
}

export const AllMoviesModal: React.FC<AllMoviesModalProps> = ({
  movies,
  isOpen,
  onClose,
  onBookMovie,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = movies.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedFormat === 'all') return true;
    return m.formats.some((f) => f.toLowerCase().includes(selectedFormat.toLowerCase()));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 space-y-4 max-h-[90vh] flex flex-col">
        {/* Notch */}
        <div className="w-10 h-1 bg-surface-variant rounded-full mx-auto sm:hidden flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-primary-container rounded-full" />
            <h3 className="font-headline font-bold text-on-surface text-base">
              All Now Showing ({filtered.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2 flex-shrink-0">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all now showing films..."
              className="w-full bg-surface-container-low text-xs text-on-surface pl-9 pr-8 py-2 rounded-xl border border-white/5 focus:border-primary-container focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 text-on-surface-variant hover:text-white p-0.5"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {['all', 'IMAX', 'Dolby', '4DX'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  selectedFormat === fmt
                    ? 'bg-primary-container text-on-primary-container font-bold glow-amber'
                    : 'bg-surface-container-high border border-white/5 text-on-surface-variant hover:text-white'
                }`}
              >
                {fmt === 'all' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant text-xs">
              No films match your search. Try another format or keyword.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-surface-container-low rounded-xl border border-white/5 overflow-hidden group hover:border-primary/40 transition-all flex flex-col cursor-pointer"
                  onClick={() => {
                    onClose();
                    onBookMovie(movie);
                  }}
                >
                  <div className="relative h-44 w-full overflow-hidden bg-surface-container-highest">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-surface-container-lowest/80 backdrop-blur-md px-1.5 py-0.2 rounded text-[10px] font-bold text-primary flex items-center gap-0.5">
                      <span
                        className="material-symbols-outlined text-[11px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      {movie.rating}
                    </div>
                    <span className="absolute bottom-1.5 left-1.5 bg-surface-container-high/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-on-surface tracking-wider uppercase">
                      {movie.formats[0] || 'IMAX 3D'}
                    </span>
                  </div>

                  <div className="p-2 flex-1 flex flex-col justify-between space-y-1.5">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface truncate font-headline">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant truncate">
                        {movie.genres.join(' • ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-[10px] text-primary font-bold">
                        {movie.nowShowingSlots?.[0] || '18:40'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-headline font-bold text-[10px] group-hover:glow-amber">
                        Book
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
