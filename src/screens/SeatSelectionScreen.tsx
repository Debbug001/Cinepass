import React, { useEffect, useState } from 'react';
import { Movie, TheatreSchedule, ShowtimeSlot, Seat } from '../types';
import { DbSeat, getSeats } from '../api';

interface SeatSelectionScreenProps {
  movie: Movie;
  theatre: TheatreSchedule;
  dateStr: string;
  slot: ShowtimeSlot;
  onBack: () => void;
  onProceedToCheckout: (
    selectedSeats: Seat[],
    subtotal: number,
    bookingFee: number,
    taxes: number,
    total: number
  ) => void;
  onShareShowtime?: () => void;
}

export const SeatSelectionScreen: React.FC<SeatSelectionScreenProps> = ({
  movie,
  theatre,
  dateStr,
  slot,
  onBack,
  onProceedToCheckout,
  onShareShowtime,
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);
  const [seatLoadError, setSeatLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const showId = slot.showId ?? Number(slot.id);
    setIsLoadingSeats(true);
    setSeatLoadError(null);
    setSeats([]);

    getSeats(showId)
      .then((rows) => {
        if (cancelled) return;
        setSeats(rows.map(mapDatabaseSeat));
      })
      .catch((error: unknown) => {
        if (!cancelled) setSeatLoadError(error instanceof Error ? error.message : 'Failed to load seats.');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSeats(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slot.id, slot.showId]);

  function mapDatabaseSeat(seat: DbSeat): Seat {
    const rawType = seat.seatType.toUpperCase();
    const tier: Seat['tier'] = rawType === 'VIP' ? 'vip' : rawType === 'PREMIUM' ? 'premium' : 'standard';
    const row = tier === 'vip' ? 'G' : tier === 'premium' ? 'E' : 'A';
    const price = tier === 'vip' ? 550 : tier === 'premium' ? 380 : 220;
    return {
      id: `${row}${seat.seatNumber}`,
      dbSeatId: seat.seatId,
      row,
      number: seat.seatNumber,
      tier,
      price,
      status: seat.status,
      isLounger: tier === 'vip',
    };
  }

  // Toggle seat selection
  const handleToggleSeat = (seatId: string) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.id !== seatId) return s;
        if (s.status === 'reserved') return s;
        return {
          ...s,
          status: s.status === 'selected' ? 'available' : 'selected',
        };
      })
    );
  };

  const selectedSeats = seats.filter((s) => s.status === 'selected');
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  // Constants matching the mockup breakdown
  const bookingFee = selectedSeats.length > 0 ? 75 : 0;
  const taxes = selectedSeats.length > 0 ? 130 : 0;
  const totalAmount = subtotal + bookingFee + taxes;

  // Determine main tier label
  const tierName =
    selectedSeats.length === 0
      ? 'No Seats Selected'
      : selectedSeats.every((s) => s.tier === 'premium')
      ? 'Premium Club'
      : selectedSeats.every((s) => s.tier === 'vip')
      ? 'VIP Recliner'
      : selectedSeats.every((s) => s.tier === 'standard')
      ? 'Standard'
      : 'Mixed Tiers';

  // Group seats by row
  const getSeatsByRow = (row: string) => seats.filter((s) => s.row === row);

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface antialiased flex flex-col justify-between overflow-x-hidden relative select-none">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-surface-container-lowest/85 backdrop-blur-md px-4 h-16 w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto right-0 flex items-center justify-between border-b border-outline-variant/10">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go Back"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container text-on-surface active:scale-95 transition-transform duration-150 hover:text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline font-bold text-base text-on-surface tracking-tight truncate max-w-[200px]">
            {movie.title}
          </h1>
          <p className="text-xs text-outline flex items-center gap-1 mt-0.5">
            <span className="truncate max-w-[90px]">{theatre.name}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-outline" />
            <span>{theatre.auditorium.replace('Auditorium ', 'Screen ')}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-outline" />
            <span className="text-primary font-bold">{slot.time}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onShareShowtime}
          aria-label="Share showtime"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container text-on-surface active:scale-95 transition-transform duration-150 hover:text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">ios_share</span>
        </button>
      </header>

      {/* Main Interaction Canvas */}
      <main className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-20 pb-44 px-3 flex flex-col items-center relative">
        {isLoadingSeats && <p className="w-full py-3 text-center text-xs text-on-surface-variant">Loading seat availability from MySQL…</p>}
        {seatLoadError && <div role="alert" className="w-full rounded-xl border border-red-400/30 bg-red-950/20 p-3 text-xs text-red-200">Could not load seats: {seatLoadError}</div>}
        {!isLoadingSeats && !seatLoadError && seats.length === 0 && <p className="w-full py-3 text-center text-xs text-on-surface-variant">No seats are configured for this screen.</p>}
        {/* Cinema Screen Projection Visualizer */}
        <div className="w-full flex flex-col items-center mt-2 mb-6">
          <div className="relative w-11/12 flex flex-col items-center">
            {/* Curved Screen Beam SVG */}
            <svg
              className="w-full h-8 glow-screen overflow-visible"
              fill="none"
              viewBox="0 0 320 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 24C100 8 220 8 308 24" stroke="#f59e0b" strokeLinecap="round" strokeWidth="3" />
            </svg>
            {/* Light Dispersion Field */}
            <div className="w-10/12 h-10 -mt-3 bg-gradient-to-b from-primary-container/20 to-transparent blur-md pointer-events-none rounded-t-full" />
            <span className="text-[10px] tracking-widest text-outline uppercase -mt-4 font-bold">
              SCREEN THIS WAY
            </span>
          </div>
        </div>

        {/* Seat Matrix Legend Bar */}
        <div className="w-full bg-surface-container/70 backdrop-blur-md rounded-xl p-2 mb-6 flex items-center justify-around">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border border-surface-variant bg-surface-container-high inline-block" />
            <span className="text-xs text-on-surface-variant">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-primary-container glow-amber inline-block" />
            <span className="text-xs text-primary font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-surface-container-highest/40 inline-block" />
            <span className="text-xs text-outline">Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-3.5 rounded-sm bg-tertiary/20 border border-tertiary/40 inline-block" />
            <span className="text-xs text-tertiary">VIP Recliner</span>
          </div>
        </div>

        {/* Interactive Auditorium Grid Container */}
        <div className="w-full overflow-x-auto no-scrollbar py-2">
          <div className="min-w-[340px] flex flex-col gap-3 items-center">
            {/* Standard Tier Category Label */}
            <div className="w-full flex items-center justify-between px-2 text-outline text-[11px] font-semibold">
              <span>STANDARD SEATS (₹220)</span>
              <span className="h-[1px] flex-1 mx-3 bg-surface-variant/40" />
              <span>TIER 1</span>
            </div>

            {/* Standard Rows A, B, C, D */}
            {['A', 'B', 'C', 'D'].map((rowLetter) => {
              const rowSeats = getSeatsByRow(rowLetter);
              const leftGroup = rowSeats.slice(0, 3);
              const midGroup = rowSeats.slice(3, 7);
              const rightGroup = rowSeats.slice(7, 10);

              const renderSeatButton = (seat: Seat) => {
                const isSelected = seat.status === 'selected';
                const isReserved = seat.status === 'reserved';

                if (isReserved) {
                  return (
                    <button
                      key={seat.id}
                      disabled
                      title={`Seat ${seat.id} (Reserved)`}
                      className="w-6 h-6 rounded-full bg-surface-container-highest/30 opacity-40 cursor-not-allowed"
                    />
                  );
                }

                if (isSelected) {
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleToggleSeat(seat.id)}
                      title={`Seat ${seat.id} (Selected)`}
                      className="w-6 h-6 rounded-full bg-primary-container text-surface-container-lowest font-bold text-[10px] flex items-center justify-center glow-amber active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </button>
                  );
                }

                // Available
                return (
                  <button
                    key={seat.id}
                    onClick={() => handleToggleSeat(seat.id)}
                    title={`Seat ${seat.id}`}
                    className={`w-6 h-6 rounded-full bg-surface-container-high border transition-transform active:scale-95 flex items-center justify-center ${
                      seat.isWheelchair
                        ? 'border-outline/50 text-primary-fixed hover:border-primary'
                        : 'border-surface-variant hover:border-outline'
                    }`}
                  >
                    {seat.isWheelchair && (
                      <span className="material-symbols-outlined text-[13px]">accessible</span>
                    )}
                  </button>
                );
              };

              return (
                <div key={rowLetter} className="flex items-center gap-2">
                  <span className="w-4 text-center text-xs font-semibold text-outline">{rowLetter}</span>
                  <div className="flex items-center gap-1.5">
                    {leftGroup.map(renderSeatButton)}
                    <div className="w-3" />
                    {midGroup.map(renderSeatButton)}
                    <div className="w-3" />
                    {rightGroup.map(renderSeatButton)}
                  </div>
                  <span className="w-4 text-center text-xs font-semibold text-outline">{rowLetter}</span>
                </div>
              );
            })}

            {/* Premium Club Category Label */}
            <div className="w-full flex items-center justify-between px-2 mt-2 text-primary text-[11px] font-semibold">
              <span>PREMIUM CLUB (₹380)</span>
              <span className="h-[1px] flex-1 mx-3 bg-primary/20" />
              <span>TIER 2</span>
            </div>

            {/* Rows E, F */}
            {['E', 'F'].map((rowLetter) => {
              const rowSeats = getSeatsByRow(rowLetter);
              const leftGroup = rowSeats.slice(0, 3);
              const midGroup = rowSeats.slice(3, 7);
              const rightGroup = rowSeats.slice(7, 10);

              const renderPremiumSeatButton = (seat: Seat) => {
                const isSelected = seat.status === 'selected';
                const isReserved = seat.status === 'reserved';

                if (isReserved) {
                  return (
                    <button
                      key={seat.id}
                      disabled
                      title={`Seat ${seat.id} (Reserved)`}
                      className="w-7 h-6 rounded-md bg-surface-container-highest/30 opacity-40 cursor-not-allowed"
                    />
                  );
                }

                if (isSelected) {
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleToggleSeat(seat.id)}
                      title={`Seat ${seat.id} (Selected)`}
                      className="w-7 h-6 rounded-md bg-primary-container text-surface-container-lowest font-bold text-[10px] flex items-center justify-center glow-amber active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={seat.id}
                    onClick={() => handleToggleSeat(seat.id)}
                    title={`Seat ${seat.id}`}
                    className="w-7 h-6 rounded-md bg-surface-container-high border border-surface-variant hover:border-primary active:scale-95 transition-transform"
                  />
                );
              };

              return (
                <div key={rowLetter} className="flex items-center gap-2">
                  <span
                    className={`w-4 text-center text-xs font-semibold ${
                      rowLetter === 'E' ? 'text-primary font-bold' : 'text-outline'
                    }`}
                  >
                    {rowLetter}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {leftGroup.map(renderPremiumSeatButton)}
                    <div className="w-3" />
                    {midGroup.map(renderPremiumSeatButton)}
                    <div className="w-3" />
                    {rightGroup.map(renderPremiumSeatButton)}
                  </div>
                  <span
                    className={`w-4 text-center text-xs font-semibold ${
                      rowLetter === 'E' ? 'text-primary font-bold' : 'text-outline'
                    }`}
                  >
                    {rowLetter}
                  </span>
                </div>
              );
            })}

            {/* VIP Recliner Category Label */}
            <div className="w-full flex items-center justify-between px-2 mt-2 text-tertiary text-[11px] font-semibold">
              <span>VIP RECLINER WITH LOUNGER (₹550)</span>
              <span className="h-[1px] flex-1 mx-3 bg-tertiary/20" />
              <span>TIER 3</span>
            </div>

            {/* Rows G, H (VIP Loungers) */}
            {['G', 'H'].map((rowLetter) => {
              const rowSeats = getSeatsByRow(rowLetter);
              const leftGroup = rowSeats.slice(0, 2);
              const midGroup = rowSeats.slice(2, 4);
              const rightGroup = rowSeats.slice(4, 6);

              const renderLoungerButton = (seat: Seat) => {
                const isSelected = seat.status === 'selected';
                const isReserved = seat.status === 'reserved';

                if (isReserved) {
                  return (
                    <button
                      key={seat.id}
                      disabled
                      title={`VIP Lounger ${seat.id} (Reserved)`}
                      className="w-10 h-7 rounded-lg bg-surface-container-highest/30 opacity-40 cursor-not-allowed flex items-center justify-center text-outline"
                    >
                      <span className="material-symbols-outlined text-[14px]">weekend</span>
                    </button>
                  );
                }

                if (isSelected) {
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleToggleSeat(seat.id)}
                      title={`VIP Lounger ${seat.id} (Selected)`}
                      className="w-10 h-7 rounded-lg bg-primary-container text-surface-container-lowest glow-amber flex items-center justify-center font-bold active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={seat.id}
                    onClick={() => handleToggleSeat(seat.id)}
                    title={`VIP Lounger ${seat.id}`}
                    className="w-10 h-7 rounded-lg bg-surface-container border border-tertiary/30 hover:border-tertiary flex items-center justify-center text-tertiary-fixed active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[14px]">weekend</span>
                  </button>
                );
              };

              return (
                <div key={rowLetter} className="flex items-center gap-2">
                  <span className="w-4 text-center text-xs font-semibold text-tertiary">{rowLetter}</span>
                  <div className="flex items-center gap-2">
                    {leftGroup.map(renderLoungerButton)}
                    <div className="w-2" />
                    {midGroup.map(renderLoungerButton)}
                    <div className="w-2" />
                    {rightGroup.map(renderLoungerButton)}
                  </div>
                  <span className="w-4 text-center text-xs font-semibold text-tertiary">{rowLetter}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Audio & Hall Spec Pills */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[14px] text-primary">surround_sound</span>
            <span>Dolby Atmos 7.1</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[14px] text-primary">aspect_ratio</span>
            <span>IMAX Laser Dual 4K</span>
          </div>
        </div>
      </main>

      {/* Bottom Fixed Floating Checkout Sheet */}
      <section className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto p-4 bg-surface-container-low/95 backdrop-blur-2xl rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.8)] border-t border-white/10">
        <div className="w-10 h-1 bg-surface-variant rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-base text-on-surface">
                Seats: {selectedSeats.length > 0 ? selectedSeats.map((s) => s.id).join(', ') : 'None'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[10px] font-bold">
                {tierName}
              </span>
            </div>
            <p className="text-xs text-outline mt-0.5">
              {selectedSeats.length} {selectedSeats.length === 1 ? 'Ticket' : 'Tickets'} • ₹
              {subtotal.toLocaleString()} + GST
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-outline uppercase tracking-wider block font-semibold">
              Total Amount
            </span>
            <span className="font-headline font-extrabold text-xl text-primary">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={selectedSeats.length === 0 || isLoadingSeats || Boolean(seatLoadError) || isSubmitting}
          onClick={() => {
            if (isSubmitting || isLoadingSeats || seatLoadError) return;
            setIsSubmitting(true);
            Promise.resolve(onProceedToCheckout(selectedSeats, subtotal, bookingFee, taxes, totalAmount))
              .catch(() => {})
              .finally(() => setIsSubmitting(false));
          }}
          className={`w-full py-3.5 px-4 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 ${
            selectedSeats.length > 0
              ? 'bg-primary-container text-on-primary-container glow-amber hover:opacity-95 active:scale-[0.98]'
              : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'
          }`}
        >
          <span>{isSubmitting ? 'Saving Booking…' : isLoadingSeats ? 'Loading Seats…' : seatLoadError ? 'Seats Unavailable' : selectedSeats.length > 0 ? 'Proceed to Checkout' : 'Select Seats to Proceed'}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </section>
    </div>
  );
};
