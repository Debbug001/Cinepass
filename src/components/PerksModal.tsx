import React from 'react';

interface PerksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const PerksModal: React.FC<PerksModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-surface-container rounded-t-2xl sm:rounded-2xl border border-white/10 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-surface-variant rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">stars</span>
            <h3 className="font-headline font-bold text-on-surface text-base">CinePass Elite Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/20 via-surface-container-high to-surface-container p-4 border border-primary/30">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">VIP Tier Active</span>
          <h4 className="text-xl font-bold font-headline text-on-surface mt-1">Unlimited IMAX Screenings</h4>
          <p className="text-xs text-on-surface-variant mt-1">
            Experience the pinnacle of cinema with priority auditorium entry, zero convenience fees, and 20% off all food & drinks.
          </p>
        </div>

        {/* Perks list */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">theaters</span>
            <div>
              <p className="font-bold text-on-surface font-headline">2 Free IMAX 70mm Passes / Month</p>
              <p className="text-on-surface-variant text-[11px]">Valid across Starlight, Grand Dolby, and Cineplex</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">fastfood</span>
            <div>
              <p className="font-bold text-on-surface font-headline">20% Off All Gourmet Concessions</p>
              <p className="text-on-surface-variant text-[11px]">Automatic discount applied at cinema counter</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low border border-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">local_parking</span>
            <div>
              <p className="font-bold text-on-surface font-headline">Complimentary Valet Parking</p>
              <p className="text-on-surface-variant text-[11px]">Priority drop-off at Starlight IMAX Grand Blvd</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onUpgradeSuccess();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-primary-container text-on-primary-container font-headline font-bold text-sm flex items-center justify-center gap-2 glow-amber active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          Activate Elite Membership • $19.99/mo
        </button>
      </div>
    </div>
  );
};
