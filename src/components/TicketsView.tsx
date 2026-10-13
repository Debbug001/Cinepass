import React from 'react';
import { BookingState } from '../types';

interface TicketsViewProps {
  bookings: BookingState[];
  onOpenConfirmedTicket: (booking: BookingState) => void;
  onRemoveTicket: (bookingId: string) => void;
  onClearAllTickets: () => void;
  onBookMore: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  bookings,
  onOpenConfirmedTicket,
  onRemoveTicket,
  onClearAllTickets,
  onBookMore,
}) => {
  const hasTickets = bookings.length > 0;

  return (
    <div className="space-y-4 px-4 pt-2 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-headline text-on-surface">My Tickets</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Active passes and reserved screenings</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              hasTickets
                ? 'bg-primary-container/20 text-primary border-primary/40'
                : 'bg-surface-container-high text-on-surface-variant border-white/10'
            }`}
          >
            {bookings.length} {bookings.length === 1 ? 'Active Pass' : 'Active Passes'}
          </span>
          {hasTickets && (
            <button
              onClick={onClearAllTickets}
              className="text-[11px] font-semibold text-error hover:underline px-1 py-0.5 active:scale-95 transition-transform"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Empty State when no tickets booked */}
      {!hasTickets ? (
        <div className="rounded-2xl bg-surface-container-low border border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-3.5 my-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
          </div>

          <div className="space-y-1">
            <h3 className="font-headline font-bold text-base text-on-surface">No Tickets Booked</h3>
            <p className="text-xs text-on-surface-variant max-w-[260px] leading-relaxed">
              You do not have any active movie reservations. Pick a movie, choose your seats, and your digital entry passes will appear here.
            </p>
          </div>

          <button
            type="button"
            onClick={onBookMore}
            className="mt-2 py-2.5 px-5 rounded-xl bg-primary-container text-on-primary-container font-headline font-bold text-xs flex items-center justify-center gap-2 glow-amber active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              movie
            </span>
            Explore Now Showing
          </button>
        </div>
      ) : (
        /* Active Tickets List */
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="relative rounded-2xl bg-surface-container border border-primary-container/40 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary-container/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    Upcoming Screening
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-primary">{booking.bookingId}</span>
                  <button
                    onClick={() => onRemoveTicket(booking.bookingId)}
                    title="Remove this ticket"
                    className="text-on-surface-variant hover:text-error p-1 rounded-lg hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Movie Info */}
              <div className="mt-3 flex gap-3">
                <img
                  src={booking.movie.posterUrl}
                  alt={booking.movie.title}
                  className="w-16 h-22 rounded-lg object-cover flex-shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-primary-container text-surface-container-lowest font-bold text-[9px]">
                      {booking.selectedSlot.format || 'IMAX 3D'}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{booking.movie.ageRating}</span>
                  </div>
                  <h3 className="font-headline font-bold text-on-surface text-base truncate mt-0.5">
                    {booking.movie.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{booking.theatre.name}</p>
                  <p className="text-xs text-primary font-semibold mt-1">
                    {booking.dateStr} • {booking.selectedSlot.time}
                  </p>
                </div>
              </div>

              {/* Seats and Hall badge */}
              <div className="mt-3 pt-3 border-t border-dashed border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-on-surface-variant text-[11px] block">Seats</span>
                  <span className="font-bold text-primary font-headline">
                    Row {booking.selectedSeats[0]?.row || 'E'} •{' '}
                    {booking.selectedSeats.map((s) => s.number).join(', ')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-on-surface-variant text-[11px] block">Gate & Level</span>
                  <span className="font-bold text-on-surface font-headline">{booking.gateLevel}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onOpenConfirmedTicket(booking)}
                  className="flex-1 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-headline font-bold text-xs flex items-center justify-center gap-2 glow-amber active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                  View Gate Pass & Barcode
                </button>
                <button
                  onClick={() => onRemoveTicket(booking.bookingId)}
                  className="px-3 py-2.5 rounded-xl bg-surface-container-high border border-white/10 hover:border-error/50 text-on-surface-variant hover:text-error text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book More CTA */}
      {hasTickets && (
        <div className="pt-2">
          <button
            onClick={onBookMore}
            className="w-full py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">add</span>
            Book Another Movie
          </button>
        </div>
      )}
    </div>
  );
};
