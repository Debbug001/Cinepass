import React, { useState } from 'react';
import { THEATRES } from '../data/mockData';
import { TheatreSchedule, Movie } from '../types';

interface CinemasViewProps {
  onSelectTheatreShowtimes: (theatre: TheatreSchedule) => void;
  onOpenDirections: (theatre: TheatreSchedule) => void;
}

export const CinemasView: React.FC<CinemasViewProps> = ({
  onSelectTheatreShowtimes,
  onOpenDirections,
}) => {
  const [filterFormat, setFilterFormat] = useState<'all' | 'laser' | 'dolby'>('all');

  const filteredTheatres = THEATRES.filter((t) => {
    if (filterFormat === 'laser') return t.badgeType === 'laser';
    if (filterFormat === 'dolby') return t.badgeType === 'dolby';
    return true;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="px-4 pt-2">
        <h2 className="text-xl font-bold font-headline text-on-surface">Cinema Theatres</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Select a nearby cinema to view hall specs, audio systems, and screening schedules.
        </p>

        {/* Filter buttons */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterFormat('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterFormat === 'all'
                ? 'bg-primary-container text-on-primary-container font-bold glow-amber'
                : 'bg-surface-container-high border border-white/10 text-on-surface'
            }`}
          >
            All Theatres ({THEATRES.length})
          </button>
          <button
            onClick={() => setFilterFormat('laser')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterFormat === 'laser'
                ? 'bg-primary-container text-on-primary-container font-bold glow-amber'
                : 'bg-surface-container-high border border-white/10 text-on-surface'
            }`}
          >
            Laser IMAX
          </button>
          <button
            onClick={() => setFilterFormat('dolby')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterFormat === 'dolby'
                ? 'bg-primary-container text-on-primary-container font-bold glow-amber'
                : 'bg-surface-container-high border border-white/10 text-on-surface'
            }`}
          >
            Dolby Cinema Atmos
          </button>
        </div>
      </div>

      {/* Theatres Feed */}
      <div className="px-4 space-y-3.5">
        {filteredTheatres.map((theatre) => (
          <div
            key={theatre.id}
            className="p-4 rounded-xl bg-surface-container-low border border-white/10 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-on-surface text-base">{theatre.name}</h3>
                  {theatre.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-primary/20 text-primary border border-primary/40">
                      {theatre.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">pin_drop</span>
                  <span>{theatre.address}</span>
                  <span>•</span>
                  <span className="text-primary font-medium">{theatre.distance}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-on-surface-variant block">Price Range</span>
                <span className="text-xs font-bold text-primary">{theatre.priceRange}</span>
              </div>
            </div>

            {/* Auditorium Spec */}
            <div className="p-2.5 rounded-lg bg-surface-container border border-white/5 text-xs text-primary-fixed-dim flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">videocam</span>
                <span>{theatre.screenName}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                {theatre.auditorium}
              </span>
            </div>

            {/* Amenities list */}
            <div className="flex flex-wrap gap-2 text-[11px] text-on-surface-variant">
              {theatre.amenities.parking && (
                <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md border border-white/5">
                  <span className="material-symbols-outlined text-[12px] text-primary">local_parking</span>
                  {theatre.amenities.parking}
                </span>
              )}
              {theatre.amenities.seating && (
                <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md border border-white/5">
                  <span className="material-symbols-outlined text-[12px] text-primary">weekend</span>
                  {theatre.amenities.seating}
                </span>
              )}
              {theatre.amenities.food && (
                <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-md border border-white/5">
                  <span className="material-symbols-outlined text-[12px] text-tertiary">dinner_dining</span>
                  {theatre.amenities.food}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
              <button
                onClick={() => onSelectTheatreShowtimes(theatre)}
                className="py-2 px-3 rounded-lg bg-primary-container text-on-primary-container font-headline font-bold text-xs flex items-center justify-center gap-1.5 glow-amber active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                View Showtimes
              </button>
              <button
                onClick={() => onOpenDirections(theatre)}
                className="py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-headline font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">near_me</span>
                Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
