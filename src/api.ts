const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:5000/api' : ''))
  .replace(/\/+$/, '');

export interface DbMovie {
  id: number;
  title: string;
  language: string;
  genre: string;
  duration: number;
  releaseDate: string | null;
}

export interface DbShow {
  showId: number;
  showDate: string;
  showTime: string;
  movieId: number;
  screenId: number;
  screenName: string;
  screenCapacity: number;
  theatreId: number;
  theatreName: string;
  location: string;
}

export interface DbSeat {
  seatId: number;
  seatNumber: number;
  seatType: string;
  screenId: number;
  status: 'available' | 'reserved';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error('API URL is not configured. Set VITE_API_URL to your deployed backend URL ending in /api.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Request failed (${response.status})`);
  }
  return result as T;
}

export function getMovies() {
  return request<DbMovie[]>('/movies');
}

export function getShows(movieId: number) {
  return request<DbShow[]>(`/movies/${movieId}/shows`);
}

export function getSeats(showId: number) {
  return request<DbSeat[]>(`/shows/${showId}/seats`);
}

export interface CreateBookingResult {
  success: true;
  bookingId: number;
  paymentId: number;
  ticketIds: number[];
  showId: number;
  seatIds: number[];
  subtotal: number;
  bookingFee: number;
  taxes: number;
  totalAmount: number;
  paymentMode: string;
  paymentStatus: string;
  message: string;
}

export function createBooking(
  showId: number,
  seatIds: number[],
  paymentMode: string,
) {
  return request<CreateBookingResult>('/bookings', {
    method: 'POST',
    body: JSON.stringify({ showId, seatIds, paymentMode }),
  });
}

export function getReport<T>(reportPath: string) {
  return request<T>(`/reports/${reportPath}`);
}

export function cancelBooking(bookingId: number) {
  return request<{ success: true; bookingId: number; message: string }>(`/bookings/${bookingId}`, {
    method: 'DELETE',
  });
}
