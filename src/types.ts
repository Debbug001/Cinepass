export type ScreenId = 'home' | 'showtimes' | 'seats' | 'confirmed';
export type NavTabId = 'movies' | 'cinemas' | 'tickets' | 'profile';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  bannerUrl: string;
  rating: number;
  imdbRating?: string;
  ageRating: string;
  runtime: string;
  genres: string[];
  formats: string[];
  synopsis: string;
  isSpotlight?: boolean;
  spotlightBadge?: string;
  spotlightTag?: string;
  releaseDate?: string;
  isUpcoming?: boolean;
  upcomingReleaseDate?: string;
  cast?: string[];
  director?: string;
  trailerYoutubeId?: string;
  nowShowingSlots?: string[];
}

export interface ShowtimeSlot {
  id: string;
  time: string;
  format: string;
  badge?: 'Fast' | 'VIP' | 'Selected' | 'Sold Out';
  fillingStatus?: string;
  priceStart?: number;
  showId?: number;
  showDate?: string;
}

export interface TheatreSchedule {
  id: string;
  name: string;
  distance: string;
  address: string;
  badge?: string;
  badgeType?: 'laser' | 'dolby' | 'standard';
  priceRange: string;
  auditorium: string;
  screenName: string;
  amenities: {
    parking?: string;
    seating?: string;
    audio?: string;
    food?: string;
    accessibility?: string;
  };
  slots: ShowtimeSlot[];
}

export type SeatTier = 'standard' | 'premium' | 'vip';

export interface Seat {
  id: string; // e.g. "A1", "E5"
  row: string; // e.g. "A", "E"
  number: number; // 1-10
  tier: SeatTier;
  price: number;
  status: 'available' | 'reserved' | 'selected';
  isWheelchair?: boolean;
  isLounger?: boolean;
  dbSeatId?: number;
}

export interface BookingState {
  bookingId: string;
  movie: Movie;
  theatre: TheatreSchedule;
  dateStr: string; // e.g., "Fri, Oct 25, 2024"
  dateKey: string; // e.g., "Oct 25"
  selectedSlot: ShowtimeSlot;
  selectedSeats: Seat[];
  ticketPriceSubtotal: number;
  bookingFee: number;
  taxes: number;
  totalAmount: number;
  paymentMethod: string;
  paymentTime: string;
  gateLevel: string;
  auditoriumNumber: string;
  qrCodeData: string;
  barcodeNumber: string;
}
