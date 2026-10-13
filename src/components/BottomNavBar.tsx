import React from 'react';
import { NavTabId } from '../types';

interface BottomNavBarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  hasActiveTickets?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  hasActiveTickets = true,
}) => {
  const tabs = [
    { id: 'movies' as NavTabId, label: 'Movies', icon: 'local_movies' },
    { id: 'cinemas' as NavTabId, label: 'Cinemas', icon: 'theater_comedy' },
    { id: 'tickets' as NavTabId, label: 'Tickets', icon: 'confirmation_number', hasBadge: hasActiveTickets },
    { id: 'profile' as NavTabId, label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/20 px-4 py-2 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center justify-center font-medium text-[11px] gap-1 py-1 active:scale-95 transition-transform duration-150 ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary-fixed'
            }`}
          >
            <div className="relative">
              <span
                className="material-symbols-outlined text-[24px]"
                data-icon={tab.icon}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              {tab.hasBadge && tab.id === 'tickets' && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-primary-container ring-1 ring-surface-container-lowest" />
              )}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
