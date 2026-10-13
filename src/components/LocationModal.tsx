import React from 'react';

interface LocationModalProps {
  currentLocation: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  currentLocation,
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  if (!isOpen) return null;

  const locations = [
    { name: 'Metropolis Downtown', distance: '1.2 km', venues: '3 IMAX / Dolby Theatres', isCurrent: true },
    { name: 'Westside Boulevard', distance: '3.5 km', venues: '2 Dolby Cinema complexes', isCurrent: false },
    { name: 'Uptown Square', distance: '4.8 km', venues: 'Multiplex 4K screens', isCurrent: false },
    { name: 'Riverfront Plaza Mall', distance: '5.6 km', venues: 'VIP Recliner Cineplex', isCurrent: false },
    { name: 'Midtown Science Center', distance: '8.1 km', venues: 'Omnimax 70mm Dome', isCurrent: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-surface-container rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-surface-variant rounded-full mx-auto sm:hidden" />
        
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">my_location</span>
            <h3 className="font-headline font-bold text-on-surface text-base">Select Your City / District</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant">
          Choose your neighborhood to see available showtimes, premium formats, and nearest auditoriums.
        </p>

        <div className="space-y-2">
          {locations.map((loc) => {
            const isSelected = loc.name === currentLocation;
            return (
              <button
                key={loc.name}
                onClick={() => {
                  onSelectLocation(loc.name);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-primary-container/15 border-primary-container text-on-surface'
                    : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-primary text-surface-container-lowest' : 'bg-surface-container-high text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>
                      location_on
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface font-headline">{loc.name}</h4>
                    <p className="text-xs text-on-surface-variant">{loc.venues}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-primary font-medium">{loc.distance}</span>
                  {isSelected && (
                    <span className="block text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
