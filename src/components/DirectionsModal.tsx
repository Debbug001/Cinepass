import React from 'react';
import { TheatreSchedule } from '../types';

interface DirectionsModalProps {
  theatre: TheatreSchedule | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ theatre, isOpen, onClose }) => {
  if (!isOpen || !theatre) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-surface-container rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-surface-variant rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">directions</span>
            <h3 className="font-headline font-bold text-on-surface text-base">Cinema Directions</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Cinema card */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-headline font-bold text-on-surface text-sm">{theatre.name}</h4>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
              {theatre.distance}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-primary">pin_drop</span>
            <span>{theatre.address}</span>
          </p>
          <div className="text-[11px] text-primary-fixed flex items-center gap-1.5 pt-1">
            <span className="material-symbols-outlined text-[14px]">local_parking</span>
            <span>{theatre.amenities.parking || 'Free Valet Parking Available for IMAX Patrons'}</span>
          </div>
        </div>

        {/* Map visualization graphic */}
        <div className="relative h-44 rounded-xl overflow-hidden border border-white/10 bg-surface-container-lowest">
          <div className="w-full h-full bg-[radial-gradient(#31353f_1px,transparent_1px)] [background-size:16px_16px] opacity-40 flex items-center justify-center" />
          {/* Simulated route line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 180">
            <path
              d="M 40 140 Q 120 120 180 80 T 290 40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
            {/* Start point */}
            <circle cx="40" cy="140" r="7" fill="#3b82f6" />
            <circle cx="40" cy="140" r="3" fill="#ffffff" />
            {/* Destination point */}
            <circle cx="290" cy="40" r="9" fill="#f59e0b" />
            <circle cx="290" cy="40" r="4" fill="#000000" />
          </svg>
          <div className="absolute bottom-2.5 left-3 bg-surface-container/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-on-surface">Transit Route: 12 min drive via Grand Blvd</span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-1">
          <button
            onClick={() => {
              window.open(`https://maps.google.com/?q=${encodeURIComponent(theatre.name + ' ' + theatre.address)}`, '_blank');
            }}
            className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary-container font-headline font-bold text-xs flex items-center justify-center gap-2 glow-amber active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            Open in Google Maps / Apple Maps
          </button>
        </div>
      </div>
    </div>
  );
};
