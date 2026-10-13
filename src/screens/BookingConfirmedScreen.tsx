import React from 'react';
import { BookingState } from '../types';

interface BookingConfirmedScreenProps {
  booking: BookingState;
  onBack: () => void;
  onOpenDirections: () => void;
  onAddToWallet: () => void;
  onDownloadPdf: () => void;
  onShare: () => void;
  onContactSupport: () => void;
}

export const BookingConfirmedScreen: React.FC<BookingConfirmedScreenProps> = ({
  booking,
  onBack,
  onOpenDirections,
  onAddToWallet,
  onDownloadPdf,
  onShare,
  onContactSupport,
}) => {
  const seatsListStr =
    booking.selectedSeats.length > 0
      ? booking.selectedSeats.map((s) => s.number).join(', ')
      : '5, 6, 7';
  const rowLetter = booking.selectedSeats[0]?.row || 'E';
  const seatCount = booking.selectedSeats.length || 3;

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface antialiased flex flex-col items-center justify-start pb-20 relative select-none">
      {/* Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl h-96 bg-gradient-to-b from-primary-container/15 via-secondary-container/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl flex flex-col min-h-screen relative px-4">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-14 bg-surface-container-lowest/80 backdrop-blur-md px-0 border-b border-white/5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low text-on-surface hover:text-primary transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <h1 className="font-headline font-bold text-base text-on-surface tracking-tight">
            Booking Confirmed
          </h1>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onShare}
              aria-label="Share Ticket"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low text-on-surface hover:text-primary transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              aria-label="Download Confirmation"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low text-on-surface hover:text-primary transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">file_download</span>
            </button>
          </div>
        </header>

        {/* Scrollable Flow */}
        <main className="flex-1 flex flex-col gap-4 pt-3 pb-8">
          {/* Success Status Banner */}
          <section className="flex items-center gap-3.5 p-3.5 rounded-xl bg-surface-container border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/10 via-transparent to-transparent pointer-events-none" />
            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary-container/40 shadow-[0_0_16px_rgba(245,158,11,0.25)]">
              <span
                className="material-symbols-outlined text-primary text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-base text-on-surface leading-tight">
                Payment Successful!
              </span>
              <span className="text-xs text-on-surface-variant font-medium mt-0.5">
                Booking ID: <span className="text-primary font-bold tracking-wider">{booking.bookingId}</span>
              </span>
            </div>
          </section>

          {/* Digital Perforated Cinema Ticket Card */}
          <article className="relative flex flex-col rounded-2xl bg-surface-container border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.65)] overflow-hidden">
            {/* Ticket Upper Tier */}
            <div className="relative flex flex-col">
              {/* Backdrop Banner Artwork */}
              <div className="relative h-44 w-full overflow-hidden bg-surface-container-lowest">
                <img
                  src={booking.movie.bannerUrl || booking.movie.posterUrl}
                  alt={booking.movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent" />
                
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-white/15 text-[10px] text-primary uppercase tracking-widest font-bold">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    Verified Pass
                  </span>
                </div>

                {/* Title & Format Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.5 rounded bg-primary-container text-surface-container-lowest text-[10px] font-bold tracking-wider">
                      {booking.selectedSlot.format || 'IMAX 3D'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-bright/80 backdrop-blur-sm text-on-surface text-[10px] font-semibold">
                      {booking.movie.ageRating}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">{booking.movie.runtime}</span>
                  </div>
                  <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight leading-tight drop-shadow-md">
                    {booking.movie.title}
                  </h2>
                </div>
              </div>

              {/* Metadata 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 pt-3 bg-surface-container">
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-1 mb-0.5 uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-primary">theater_comedy</span>
                    CINEMA
                  </span>
                  <p className="text-xs font-bold text-on-surface font-headline leading-tight truncate">
                    {booking.theatre.name}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">Screen 1 • Laser</p>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-1 mb-0.5 uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-primary">calendar_today</span>
                    DATE & TIME
                  </span>
                  <p className="text-xs font-bold text-on-surface font-headline leading-tight">
                    {booking.dateStr}
                  </p>
                  <p className="text-[11px] text-primary font-semibold">{booking.selectedSlot.time}</p>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-1 mb-0.5 uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-primary">chair</span>
                    RESERVED SEATS
                  </span>
                  <p className="text-xs font-bold text-primary font-headline leading-tight">
                    Row {rowLetter} • {seatsListStr}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">Prime Center (VIP)</p>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-1 mb-0.5 uppercase tracking-wider font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-primary">door_front</span>
                    HALL / GATE
                  </span>
                  <p className="text-xs font-bold text-on-surface font-headline leading-tight">
                    {booking.auditoriumNumber}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">{booking.gateLevel}</p>
                </div>
              </div>
            </div>

            {/* Realistic Perforation Line with Side Cutouts */}
            <div className="relative w-full py-1 flex items-center justify-center bg-surface-container">
              <div className="ticket-cutout-left" />
              <div className="w-full border-t-2 border-dashed border-outline-variant/40 mx-4" />
              <div className="ticket-cutout-right" />
            </div>

            {/* Ticket Lower Stub (Scanning & Verification Zone) */}
            <div className="p-4 bg-surface-container flex flex-col items-center gap-3">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Admit {seatCount === 1 ? 'One (1)' : seatCount === 2 ? 'Two (2)' : seatCount === 3 ? 'Three (3)' : `${seatCount} (${seatCount})`} • Present at Gate
                </p>
              </div>

              {/* Ultra High-Contrast Usher Scannable Container */}
              <div className="w-full bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-lg">
                {/* QR Code Matrix Graphic */}
                <div className="w-44 h-44 bg-neutral-900 rounded-lg p-2.5 flex items-center justify-center shadow-inner">
                  <div className="w-full h-full bg-white grid grid-cols-6 grid-rows-6 p-1 gap-1">
                    {/* Top-Left QR Marker */}
                    <div className="col-span-2 row-span-2 border-4 border-black p-1 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-black rounded-sm" />
                    </div>
                    <div className="col-span-2 row-span-1 bg-black" />
                    {/* Top-Right QR Marker */}
                    <div className="col-span-2 row-span-2 border-4 border-black p-1 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-black rounded-sm" />
                    </div>
                    {/* Data Cluster Pseudo Pattern */}
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    {/* Bottom-Left QR Marker */}
                    <div className="col-span-2 row-span-2 border-4 border-black p-1 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-black rounded-sm" />
                    </div>
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                    <div className="bg-black" />
                    <div className="bg-black" />
                    <div className="bg-white" />
                  </div>
                </div>

                {/* Stylized Barcode Graphic & Numeric ID */}
                <div className="mt-3 flex flex-col items-center">
                  <div className="flex items-center gap-[2.5px] h-7 w-52 overflow-hidden justify-center opacity-85">
                    <span className="w-0.5 h-full bg-black" />
                    <span className="w-1 h-full bg-black" />
                    <span className="w-0.5 h-full bg-black" />
                    <span className="w-2 h-full bg-black" />
                    <span className="w-0.5 h-full bg-black" />
                    <span className="w-1.5 h-full bg-black" />
                    <span className="w-1 h-full bg-black" />
                    <span className="w-0.5 h-full bg-black" />
                    <span className="w-2 h-full bg-black" />
                    <span className="w-1 h-full bg-black" />
                    <span className="w-0.5 h-full bg-black" />
                    <span className="w-1.5 h-full bg-black" />
                    <span className="w-2 h-full bg-black" />
                    <span className="w-0.5 h-full bg-black" />
                    <span className="w-1 h-full bg-black" />
                    <span className="w-2 h-full bg-black" />
                    <span className="w-0.5 h-full bg-black" />
                    <span className="w-1 h-full bg-black" />
                  </div>
                  <span className="font-mono text-black font-bold text-xs tracking-[0.25em] mt-1">
                    {booking.barcodeNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-medium">
                <span className="material-symbols-outlined text-[16px] text-primary">brightness_6</span>
                <span>Turn up screen brightness for fast gate check-in</span>
              </div>
            </div>
          </article>

          {/* Relational Booking & Payment Summary Card */}
          <section className="flex flex-col rounded-xl bg-surface-container border border-white/5 p-4 gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="font-headline font-bold text-sm text-on-surface">Payment Breakdown</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold uppercase">
                Paid In Full
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>
                  Tickets ({seatCount}x ₹{seatCount > 0 ? (booking.ticketPriceSubtotal / seatCount).toFixed(0) : '380'})
                </span>
                <span className="text-on-surface font-semibold">
                  ₹{booking.ticketPriceSubtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Convenience & Booking Fee</span>
                <span className="text-on-surface font-semibold">₹{booking.bookingFee.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>State Entertainment Taxes</span>
                <span className="text-on-surface font-semibold">₹{booking.taxes.toFixed(2)}</span>
              </div>

              <div className="my-1 border-t border-dashed border-outline-variant/30" />

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface font-headline">Total Amount Paid</span>
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">credit_card</span>
                    {booking.paymentMethod}
                  </span>
                </div>
                <span className="font-headline font-extrabold text-lg text-primary">
                  ₹{booking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* Action Buttons Cluster */}
          <section className="flex flex-col gap-2.5 mt-1">
            {/* Add to Apple Wallet / Google Wallet Primary Button */}
            <button
              type="button"
              onClick={onAddToWallet}
              className="w-full py-3.5 px-4 rounded-xl bg-primary-container text-surface-container-lowest font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-150"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              <span>Add to Apple Wallet / Google Wallet</span>
            </button>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onDownloadPdf}
                className="py-3 px-3 rounded-xl bg-surface-container-high/80 border border-white/10 hover:border-primary/40 text-on-surface font-headline font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">picture_as_pdf</span>
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={onOpenDirections}
                className="py-3 px-3 rounded-xl bg-surface-container-high/80 border border-white/10 hover:border-primary/40 text-on-surface font-headline font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">near_me</span>
                <span>Cinema Directions</span>
              </button>
            </div>

            {/* Cinema Notice / Policy Microtext */}
            <p className="text-center text-[11px] text-on-surface-variant/70 px-2 mt-1">
              Doors open 20 minutes before showtime. Late seating subject to cinema discretion. Need help?{' '}
              <button
                type="button"
                onClick={onContactSupport}
                className="text-primary hover:underline font-semibold"
              >
                Contact Support
              </button>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};
