import React from 'react';

interface TopAppBarProps {
  currentLocation: string;
  onOpenLocation: () => void;
  onOpenNotifications: () => void;
  onToggleSearch?: () => void;
  unreadCount?: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentLocation,
  onOpenLocation,
  onOpenNotifications,
  onToggleSearch,
  unreadCount = 2,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto z-40 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20 px-4 h-14 flex justify-between items-center transition-all">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Brand Home"
          className="flex items-center text-primary active:scale-95 transition-transform duration-150"
        >
          <span className="material-symbols-outlined text-primary text-[28px]" data-icon="movie">
            movie
          </span>
        </button>
        <span className="text-xl font-bold tracking-wider text-primary font-headline">
          CinePass
        </span>
      </div>

      {/* Location Selector Pill */}
      <button
        type="button"
        onClick={onOpenLocation}
        className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full border border-white/5 text-on-surface-variant hover:text-primary transition-colors text-xs font-semibold active:scale-95 duration-150"
        aria-label="Select city location"
      >
        <span className="material-symbols-outlined text-[16px] text-primary" data-icon="location_on">
          location_on
        </span>
        <span className="truncate max-w-[110px]">{currentLocation}</span>
        <span className="material-symbols-outlined text-[14px]" data-icon="expand_more">
          expand_more
        </span>
      </button>

      {/* Trailing Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative text-on-surface-variant hover:text-primary transition-colors active:scale-95 p-1.5 rounded-full hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[24px]" data-icon="notifications">
            notifications
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container ring-2 ring-surface-container-lowest animate-pulse" />
          )}
        </button>
        <button
          type="button"
          onClick={onToggleSearch}
          aria-label="Search"
          className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 p-1.5 rounded-full hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[24px]" data-icon="search">
            search
          </span>
        </button>
      </div>
    </header>
  );
};
