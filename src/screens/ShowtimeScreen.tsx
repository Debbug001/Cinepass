import React, { useEffect, useMemo, useState } from 'react';
import { Movie, TheatreSchedule, ShowtimeSlot } from '../types';
import { DbShow, getShows } from '../api';

interface ShowtimeScreenProps {
  movie: Movie;
  onBack: () => void;
  onSelectSeats: (
    movie: Movie,
    theatre: TheatreSchedule,
    dateKey: string,
    slot: ShowtimeSlot,
  ) => void;
  onOpenMovieInfo: (movie: Movie) => void;
}

function dateKey(value: string) {
  return String(value).slice(0, 10);
}

function prettyDate(value: string) {
  const [year, month, day] = dateKey(value).split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return {
    day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
    label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  };
}

function prettyTime(value: string) {
  const [hoursText, minutes = '00'] = String(value).split(':');
  const hours = Number(hoursText);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const clockHour = hours % 12 || 12;
  return `${String(clockHour).padStart(2, '0')}:${minutes.slice(0, 2)} ${suffix}`;
}

function makeSchedule(show: DbShow): TheatreSchedule {
  return {
    id: `${show.theatreId}-${show.screenId}`,
    name: show.theatreName,
    distance: show.location,
    address: show.location,
    priceRange: '₹220–₹550',
    auditorium: show.screenName || `Screen ${show.screenId}`,
    screenName: show.screenName || `Screen ${show.screenId}`,
    amenities: {},
    slots: [],
  };
}

function makeSlot(show: DbShow): ShowtimeSlot {
  return {
    id: String(show.showId),
    showId: show.showId,
    showDate: dateKey(show.showDate),
    time: prettyTime(show.showTime),
    format: show.screenName || 'Standard',
    priceStart: 220,
  };
}

export const ShowtimeScreen: React.FC<ShowtimeScreenProps> = ({
  movie,
  onBack,
  onSelectSeats,
  onOpenMovieInfo,
}) => {
  const [shows, setShows] = useState<DbShow[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setShows([]);
    setSelectedDate('');
    setSelectedShowId(null);

    getShows(Number(movie.id))
      .then((data) => {
        if (cancelled) return;
        setShows(data);
        if (data.length > 0) setSelectedDate(dateKey(data[0].showDate));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load showtimes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [movie.id]);

  const dates = useMemo(() => {
    return [...new Set(shows.map((show) => dateKey(show.showDate)))].sort();
  }, [shows]);

  const showsForDate = useMemo(
    () => shows.filter((show) => dateKey(show.showDate) === selectedDate),
    [shows, selectedDate],
  );

  const groupedShows = useMemo(() => {
    const groups = new Map<string, { schedule: TheatreSchedule; shows: DbShow[] }>();
    for (const show of showsForDate) {
      const key = `${show.theatreId}-${show.screenId}`;
      const existing = groups.get(key);
      if (existing) existing.shows.push(show);
      else groups.set(key, { schedule: makeSchedule(show), shows: [show] });
    }
    return [...groups.values()];
  }, [showsForDate]);

  const selectedShow = shows.find((show) => show.showId === selectedShowId) || null;

  return (
    <div className="min-h-screen bg-background text-on-surface pb-36 relative flex flex-col">
      <header className="sticky top-0 z-30 bg-surface-container-lowest/90 backdrop-blur-md px-4 py-3 border-b border-outline-variant/20">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={onBack} aria-label="Go back" className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-bright active:scale-95 transition-all text-on-surface">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex-1 min-w-0 text-center">
            <h1 className="font-headline font-bold text-base text-on-surface truncate">{movie.title}</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">{movie.genres.join(' • ')} <span className="mx-1">·</span> {movie.runtime}</p>
          </div>
          <button type="button" onClick={() => onOpenMovieInfo(movie)} aria-label="Movie details" className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-bright active:scale-95 transition-all text-on-surface">
            <span className="material-symbols-outlined text-[20px]">info</span>
          </button>
        </div>
        <div className="w-full h-1 mt-2.5 rounded-full bg-gradient-to-r from-transparent via-primary-container/40 to-transparent" />
      </header>

      <section className="py-3 px-3 bg-surface-container-low/60 border-b border-outline-variant/10">
        <p className="px-1 pb-2 text-[10px] uppercase tracking-widest text-on-surface-variant">Dates from MySQL</p>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {dates.map((date) => {
            const formatted = prettyDate(date);
            const active = selectedDate === date;
            return (
              <button key={date} type="button" onClick={() => { setSelectedDate(date); setSelectedShowId(null); }} className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-2.5 rounded-xl text-xs transition-all ${active ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container text-on-surface hover:bg-surface-bright'}`}>
                <span className="text-[10px] uppercase tracking-wider">{formatted.day}</span>
                <span className="text-sm font-headline font-bold mt-0.5">{formatted.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <main className="px-4 py-5 space-y-4 flex-1">
        {loading && <div className="py-12 text-center text-sm text-on-surface-variant">Loading showtimes from the database…</div>}
        {!loading && error && (
          <div className="rounded-xl border border-red-400/30 bg-red-950/20 p-4 text-sm">
            <p className="font-semibold">Could not load showtimes</p>
            <p className="mt-1 text-on-surface-variant">{error}</p>
            <button type="button" className="mt-3 text-primary font-semibold" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
        {!loading && !error && shows.length === 0 && (
          <div className="rounded-xl border border-outline-variant/30 p-5 text-center">
            <p className="font-semibold">No showtimes in the database</p>
            <p className="text-sm text-on-surface-variant mt-1">Add a row to SHOWS for this movie to make it bookable.</p>
          </div>
        )}
        {!loading && !error && shows.length > 0 && groupedShows.length === 0 && (
          <p className="py-8 text-center text-sm text-on-surface-variant">There are no screenings on this date.</p>
        )}

        {groupedShows.map(({ schedule, shows: group }) => (
          <article key={schedule.id} className="rounded-xl bg-surface-container-low/70 p-4 border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h2 className="font-headline font-bold text-base text-on-surface">{schedule.name}</h2>
                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                  <span>{schedule.address}</span>
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-bold rounded-md bg-primary/10 text-primary px-2 py-1">Screen {group[0].screenId}</span>
            </div>
            <div className="flex items-center gap-2 py-2 mb-3 border-y border-outline-variant/15 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              <span>{group[0].screenName} · Capacity {group[0].screenCapacity}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {group.map((show) => {
                const active = selectedShowId === show.showId;
                return (
                  <button key={show.showId} type="button" onClick={() => setSelectedShowId(show.showId)} className={`relative flex flex-col items-center justify-center p-3 rounded-lg transition-all text-center border ${active ? 'bg-primary/15 border-primary text-primary' : 'bg-surface-container border-outline-variant/30 text-on-surface hover:border-primary/50'}`}>
                    <span className="text-sm font-bold">{prettyTime(show.showTime)}</span>
                    <span className="text-[10px] text-on-surface-variant mt-1">Show #{show.showId}</span>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </main>

      {selectedShow && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/20">
          <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-on-surface-variant">Selected screening</p>
              <p className="text-sm font-bold truncate">{selectedShow.theatreName} · {prettyTime(selectedShow.showTime)}</p>
              <p className="text-[10px] text-on-surface-variant">{prettyDate(selectedDate).day}, {prettyDate(selectedDate).label}</p>
            </div>
            <button type="button" onClick={() => onSelectSeats(movie, makeSchedule(selectedShow), selectedDate, makeSlot(selectedShow))} className="shrink-0 rounded-xl bg-primary-container text-on-primary-container px-4 py-3 text-sm font-bold active:scale-95 transition-transform">
              Choose seats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
