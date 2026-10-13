/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId, NavTabId, Movie, TheatreSchedule, ShowtimeSlot, Seat, BookingState } from './types';
import { MOVIES, THEATRES, DATES_DATA } from './data/mockData';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { Toast } from './components/Toast';
import { TrailerModal } from './components/TrailerModal';
import { LocationModal } from './components/LocationModal';
import { NotificationsModal } from './components/NotificationsModal';
import { DirectionsModal } from './components/DirectionsModal';
import { PerksModal } from './components/PerksModal';
import { CinemasView } from './components/CinemasView';
import { TicketsView } from './components/TicketsView';
import { ProfileView } from './components/ProfileView';
import { cancelBooking, createBooking } from './api';

import { HomeScreen } from './screens/HomeScreen';
import { ShowtimeScreen } from './screens/ShowtimeScreen';
import { SeatSelectionScreen } from './screens/SeatSelectionScreen';
import { BookingConfirmedScreen } from './screens/BookingConfirmedScreen';

function formatDatabaseDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function App() {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [activeNavTab, setActiveNavTab] = useState<NavTabId>('movies');

  // Context State
  const [currentLocation, setCurrentLocation] = useState('Metropolis Downtown');
  const [selectedMovie, setSelectedMovie] = useState<Movie>(MOVIES[0]);
  const [selectedTheatre, setSelectedTheatre] = useState<TheatreSchedule>(THEATRES[0]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('Fri, Oct 25, 2024');
  const [selectedSlot, setSelectedSlot] = useState<ShowtimeSlot>(THEATRES[0].slots[2]); // 06:15 PM IMAX 3D

  // Bookings list: Initialized to empty array so no tickets are booked initially
  const [bookings, setBookings] = useState<BookingState[]>([]);
  const [activeConfirmedBooking, setActiveConfirmedBooking] = useState<BookingState | null>(null);

  // Modal States
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [directionsTheatre, setDirectionsTheatre] = useState<TheatreSchedule>(THEATRES[0]);
  const [isPerksOpen, setIsPerksOpen] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Handlers for Navigation Flow
  const handleBookMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setActiveScreen('showtimes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWatchTrailer = (movie: Movie) => {
    setTrailerMovie(movie);
    setIsTrailerOpen(true);
  };

  const handleSelectSeatsFromShowtimes = (
    movie: Movie,
    theatre: TheatreSchedule,
    dateKey: string,
    slot: ShowtimeSlot
  ) => {
    const fullDate = DATES_DATA.find((d) => d.key === dateKey)?.fullDate || formatDatabaseDate(dateKey);
    setSelectedMovie(movie);
    setSelectedTheatre(theatre);
    setSelectedDateStr(fullDate);
    setSelectedSlot(slot);
    setActiveScreen('seats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = async (
    selectedSeats: Seat[],
    subtotal: number,
    bookingFee: number,
    taxes: number,
    total: number
  ) => {
    try {
      const showId = selectedSlot.showId ?? Number(selectedSlot.id);
      const seatIds = selectedSeats.map((seat) => seat.dbSeatId);
      if (!Number.isInteger(showId) || showId < 1 || seatIds.some((id) => !Number.isInteger(id))) {
        throw new Error('This show or its seats are not connected to the database. Return to showtimes and select again.');
      }

      // The server re-checks availability and calculates the final amount before writing records.
      const saved = await createBooking(showId, seatIds as number[], 'Card');
      const newBookingId = `#CP-${saved.bookingId}`;
      const newBooking: BookingState = {
        bookingId: newBookingId,
        movie: selectedMovie,
        theatre: selectedTheatre,
        dateStr: selectedDateStr,
        dateKey: selectedDateStr.split(',')[1]?.trim() || selectedDateStr,
        selectedSlot,
        selectedSeats,
        ticketPriceSubtotal: saved.subtotal,
        bookingFee: saved.bookingFee,
        taxes: saved.taxes,
        totalAmount: saved.totalAmount,
        paymentMethod: saved.paymentMode,
        paymentTime: 'Just now',
        gateLevel: 'Gate 3 • Level 2',
        auditoriumNumber: selectedTheatre.auditorium || 'Screen 1',
        qrCodeData: `CINEPASS-${newBookingId}-${selectedSeats.map((seat) => seat.id).join('')}`,
        barcodeNumber: `9842 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} 20`,
      };

      setBookings((prev) => [newBooking, ...prev]);
      setActiveConfirmedBooking(newBooking);
      setActiveScreen('confirmed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`Booking ${newBookingId} saved to MySQL. Total: ₹${saved.totalAmount.toLocaleString()}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Booking failed. Please try again.';
      showToast(message);
      throw error;
    }
  };

  const extractDatabaseBookingId = (bookingId: string) => {
    const match = bookingId.match(/^#CP-(\d+)$/);
    return match ? Number(match[1]) : null;
  };

  const handleRemoveTicket = async (bookingId: string) => {
    try {
      const databaseId = extractDatabaseBookingId(bookingId);
      if (databaseId !== null) await cancelBooking(databaseId);
      setBookings((prev) => prev.filter((booking) => booking.bookingId !== bookingId));
      if (activeConfirmedBooking?.bookingId === bookingId) setActiveConfirmedBooking(null);
      showToast('Ticket cancelled and removed from MySQL.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Cancellation failed. Please try again.');
    }
  };

  const handleClearAllTickets = async () => {
    try {
      const databaseIds = bookings
        .map((booking) => extractDatabaseBookingId(booking.bookingId))
        .filter((id): id is number => id !== null);
      await Promise.all(databaseIds.map((id) => cancelBooking(id)));
      setBookings([]);
      setActiveConfirmedBooking(null);
      showToast('All tickets cancelled and removed from MySQL.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not cancel all tickets. Please try again.');
    }
  };

  const handleOpenDirections = (theatre?: TheatreSchedule) => {
    setDirectionsTheatre(theatre || selectedTheatre);
    setIsDirectionsOpen(true);
  };

  const handleAddToWallet = () => {
    showToast('Pass added to Apple Wallet / Google Wallet');
  };

  const handleDownloadPdf = () => {
    showToast('Digital Ticket PDF downloaded to device');
  };

  const handleShare = () => {
    if (!activeConfirmedBooking) return;
    if (navigator.share) {
      navigator.share({
        title: `CinePass: ${activeConfirmedBooking.movie.title}`,
        text: `I'm watching ${activeConfirmedBooking.movie.title} at ${activeConfirmedBooking.theatre.name} (${activeConfirmedBooking.dateStr} at ${activeConfirmedBooking.selectedSlot.time})!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Booking link copied to clipboard!');
    }
  };

  const handleContactSupport = () => {
    showToast('Support Concierge: Priority chat connected.');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main Responsive Mobile Frame */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto min-h-screen relative bg-surface-container-lowest overflow-x-hidden shadow-2xl flex flex-col">
        {/* Top App Bar (Only on Home Screen) */}
        {activeScreen === 'home' && (
          <TopAppBar
            currentLocation={currentLocation}
            onOpenLocation={() => setIsLocationOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onToggleSearch={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            unreadCount={bookings.length > 0 ? 1 : 0}
          />
        )}

        {/* SCREEN 1: Home & Secondary Views */}
        {activeScreen === 'home' && (
          <div className="flex-1">
            {activeNavTab === 'movies' && (
              <HomeScreen
                onBookMovie={handleBookMovie}
                onWatchTrailer={handleWatchTrailer}
                onSelectTheatre={(theatre, movie) => {
                  setSelectedTheatre(theatre);
                  setSelectedMovie(movie || { ...MOVIES[0], id: '1', title: 'Inception', runtime: '2h 28m', genres: ['Sci-Fi'] });
                  setActiveScreen('showtimes');
                }}
                onOpenUpgradePerks={() => setIsPerksOpen(true)}
                onSetReminder={(title) => {
                  showToast(`Reminder set for ${title}! We'll notify you when booking opens.`);
                }}
              />
            )}

            {activeNavTab === 'cinemas' && (
              <div className="pt-16">
                <CinemasView
                  onSelectTheatreShowtimes={(theatre) => {
                    setSelectedTheatre(theatre);
                    setSelectedMovie({ ...MOVIES[0], id: '1', title: 'Inception', runtime: '2h 28m', genres: ['Sci-Fi'] });
                    setActiveScreen('showtimes');
                  }}
                  onOpenDirections={(theatre) => handleOpenDirections(theatre)}
                />
              </div>
            )}

            {activeNavTab === 'tickets' && (
              <div className="pt-16">
                <TicketsView
                  bookings={bookings}
                  onOpenConfirmedTicket={(b) => {
                    setActiveConfirmedBooking(b);
                    setActiveScreen('confirmed');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onRemoveTicket={handleRemoveTicket}
                  onClearAllTickets={handleClearAllTickets}
                  onBookMore={() => {
                    setActiveNavTab('movies');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {activeNavTab === 'profile' && (
              <div className="pt-16">
                <ProfileView onOpenPerks={() => setIsPerksOpen(true)} />
              </div>
            )}
          </div>
        )}

        {/* SCREEN 2: Showtime Selection */}
        {activeScreen === 'showtimes' && (
          <ShowtimeScreen
            movie={selectedMovie}
            onBack={() => setActiveScreen('home')}
            onSelectSeats={handleSelectSeatsFromShowtimes}
            onOpenMovieInfo={(movie) => handleWatchTrailer(movie)}
          />
        )}

        {/* SCREEN 3: Seat Selection */}
        {activeScreen === 'seats' && (
          <SeatSelectionScreen
            movie={selectedMovie}
            theatre={selectedTheatre}
            dateStr={selectedDateStr}
            slot={selectedSlot}
            onBack={() => setActiveScreen('showtimes')}
            onProceedToCheckout={handleProceedToCheckout}
            onShareShowtime={handleShare}
          />
        )}

        {/* SCREEN 4: Booking Confirmed */}
        {activeScreen === 'confirmed' && activeConfirmedBooking && (
          <BookingConfirmedScreen
            booking={activeConfirmedBooking}
            onBack={() => {
              setActiveScreen('home');
              setActiveNavTab('tickets');
            }}
            onOpenDirections={() => handleOpenDirections(activeConfirmedBooking.theatre)}
            onAddToWallet={handleAddToWallet}
            onDownloadPdf={handleDownloadPdf}
            onShare={handleShare}
            onContactSupport={handleContactSupport}
          />
        )}

        {/* Bottom Nav Bar (Shown when on Home screen tabs) */}
        {activeScreen === 'home' && (
          <BottomNavBar
            activeTab={activeNavTab}
            onTabChange={(tab) => {
              setActiveNavTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            hasActiveTickets={bookings.length > 0}
          />
        )}
      </div>

      {/* Shared Interactive Modals */}
      <TrailerModal
        movie={trailerMovie}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        onBookNow={(movie) => {
          setIsTrailerOpen(false);
          handleBookMovie(movie);
        }}
      />

      <LocationModal
        currentLocation={currentLocation}
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          showToast(`Location switched to ${loc}`);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        activeBooking={bookings[0] || null}
        onViewBooking={() => {
          setIsNotificationsOpen(false);
          if (bookings[0]) {
            setActiveConfirmedBooking(bookings[0]);
            setActiveScreen('confirmed');
          }
        }}
      />

      <DirectionsModal
        theatre={directionsTheatre}
        isOpen={isDirectionsOpen}
        onClose={() => setIsDirectionsOpen(false)}
      />

      <PerksModal
        isOpen={isPerksOpen}
        onClose={() => setIsPerksOpen(false)}
        onUpgradeSuccess={() => {
          showToast('CinePass Elite Pass activated! Enjoy unlimited IMAX screenings.');
        }}
      />
    </div>
  );
}
