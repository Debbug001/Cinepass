import React from 'react';
import { Movie } from '../types';

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (movie: Movie) => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  movie,
  isOpen,
  onClose,
  onBookNow,
}) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface-container rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-high/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">play_circle</span>
            <h3 className="font-headline font-bold text-on-surface text-base truncate">
              {movie.title} – Official Trailer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Video Player or Simulated Cinematic Video */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {movie.trailerYoutubeId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${movie.title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={movie.bannerUrl}
                alt={movie.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg animate-pulse">
                  <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                </div>
                <span className="text-xs text-white/80 mt-2 font-medium">Click to Play Cinematic Preview</span>
              </div>
            </div>
          )}
        </div>

        {/* Movie Info Details */}
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold text-[10px]">
              {movie.ageRating}
            </span>
            <span>•</span>
            <span>{movie.runtime}</span>
            <span>•</span>
            <div className="flex items-center text-primary-fixed font-bold gap-0.5">
              <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span>{movie.imdbRating || `${movie.rating} IMDb`}</span>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            {movie.synopsis}
          </p>

          {movie.cast && (
            <div className="text-xs text-on-surface-variant">
              <span className="text-on-surface font-semibold">Starring: </span>
              {movie.cast.join(', ')}
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => {
                onClose();
                onBookNow(movie);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary-container text-on-primary-container font-headline font-bold text-sm flex items-center justify-center gap-2 glow-amber active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                confirmation_number
              </span>
              Book Showtimes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container-high border border-white/10 text-on-surface text-sm font-medium hover:bg-surface-variant active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
