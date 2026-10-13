import React from 'react';
import { BookingState } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBooking?: BookingState | null;
  onViewBooking?: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  activeBooking,
  onViewBooking,
}) => {
  if (!isOpen) return null;

  const notifications = [
    ...(activeBooking
      ? [
          {
            id: 'booking-alert',
            title: `Booking Confirmed: ${activeBooking.movie.title}`,
            message: `Seats Row ${activeBooking.selectedSeats[0]?.row || 'E'} (${activeBooking.selectedSeats.map(s => s.number).join(', ')}) at ${activeBooking.theatre.name} locked for ${activeBooking.selectedSlot.time}.`,
            time: 'Just now',
            icon: 'confirmation_number',
            isUnread: true,
            action: 'view_ticket',
          },
        ]
      : []),
    {
      id: 'welcome',
      title: 'Welcome to CinePass',
      message: 'Explore premiere IMAX 70mm, Dolby Cinema, and 4DX showtimes near you. All seats are ready to book.',
      time: 'Just now',
      icon: 'movie',
      isUnread: false,
    },
    {
      id: 'elite-info',
      title: 'New Member Perks',
      message: 'Upgrade to CinePass Elite to enjoy priority lounge entry, zero convenience fees, and 20% off concessions.',
      time: 'Just now',
      icon: 'stars',
      isUnread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-surface-container rounded-t-2xl sm:rounded-2xl border border-white/10 p-4 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-surface-variant rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">notifications</span>
            <h3 className="font-headline font-bold text-on-surface text-base">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                item.isUnread
                  ? 'bg-surface-container-high/80 border-primary/30'
                  : 'bg-surface-container-low border-white/5 opacity-80'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-on-surface font-headline truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-on-surface-variant ml-2 flex-shrink-0">{item.time}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                  {item.message}
                </p>
                {item.action === 'view_ticket' && onViewBooking && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewBooking();
                    }}
                    className="mt-2 text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
                  >
                    <span>View Digital Ticket</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
