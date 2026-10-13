import { Movie, TheatreSchedule, Seat } from '../types';

export const MOVIES: Movie[] = [
  {
    id: 'dune-2',
    title: 'Dune: Part Two',
    ageRating: 'PG-13',
    runtime: '2h 46m',
    rating: 8.8,
    imdbRating: '8.8 IMDb',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    formats: ['IMAX 70mm', 'IMAX 3D', 'Dolby Cinema', '4DX Live'],
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRCHz9CqRao--aP1V3jUkME0YHjvc26I8yAsurlEvsbrlFQiTTzmEiwRmMR5p20EAMUDse29gJNgkl5SY38BjvXOHl7Y4qZSz009Y2jT8fbwptKBS9gC5ZYf9PEAMOzmXyEQvb16p2zEv4xXwpqF_A6KNHWh3iXNBOxdnuvV1Th_pksFWyrpNDTOAJoiezUpftAdwjaLmI-d5rDLVpj5SxEEWuJyGT2lOntmEB5CKB-licZYTpffNO7Q',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7nMLt4H_jH8ekPfqDDUnvEfhyH8HFN3EiSe5WbvUNwH4dDnT5dK6uxy2bhuUMqadZrJoQI_VYxipzOPPEW7dx-MbvSt76hkvoBa8awBixWDeJjNLWXF7bl2A9RYDodMdz07GFM_hb5EoFiMLi75wS0HFrtR6YuHvIsh6bexk5cGxVxXTucghiQ4ow8rsFkR97yXWnq_HqWGXENCdw_h_eBvnAZsG_Z8uuJmXq_eqrVW6YZztFrP8v7g',
    isSpotlight: true,
    spotlightBadge: 'Spotlight',
    spotlightTag: 'IMAX Experience',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    director: 'Denis Villeneuve',
    trailerYoutubeId: 'Way9Dexny3w',
    nowShowingSlots: ['18:40', '21:15'],
  },
  {
    id: 'cyber-odyssey-2049',
    title: 'Cyber Odyssey 2049',
    ageRating: 'PG-13',
    runtime: '2h 46m',
    rating: 9.1,
    imdbRating: '9.1 IMDb',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    formats: ['IMAX 3D', 'Dolby Atmos', '4DX Live'],
    synopsis: 'In a rain-drenched neo-metropolis ruled by synthesized memories and neural conglomerates, a rogue archivist discovers an anomalous memory cluster that could dismantle the planetary mainframe.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRCHz9CqRao--aP1V3jUkME0YHjvc26I8yAsurlEvsbrlFQiTTzmEiwRmMR5p20EAMUDse29gJNgkl5SY38BjvXOHl7Y4qZSz009Y2jT8fbwptKBS9gC5ZYf9PEAMOzmXyEQvb16p2zEv4xXwpqF_A6KNHWh3iXNBOxdnuvV1Th_pksFWyrpNDTOAJoiezUpftAdwjaLmI-d5rDLVpj5SxEEWuJyGT2lOntmEB5CKB-licZYTpffNO7Q',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXM0KJOvZB2mMjveSlau7180T8wA1ih4VjDmQOLr7qrx7iHH_tX4e4GHfnI20NzOIBdCWMj_j1ice4toG_10yk6hk4RspybH9Pj08LjOnVlmthpA7IT_-ntOg8RH_PgKUS6PLbVkcgMdQy_CqhpQnKLw9GmgfN99SBlJfKZ-qSswBBp4QP1rcJE563ihOX-vQ-McDtia3UNAgIShACbcjTqeX6jKYm7c6BSuWgp19x90jo6eKVH9JXQ',
    cast: ['Ryan Gosling', 'Ana de Armas', 'Harrison Ford', 'Sylvia Hoeks'],
    director: 'Denis Villeneuve',
    trailerYoutubeId: 'gCcx85zbxz4',
    nowShowingSlots: ['18:15', '21:30'],
  },
  {
    id: 'interstellar-live',
    title: 'Interstellar: Live',
    ageRating: 'PG-13',
    runtime: '2h 49m',
    rating: 8.9,
    imdbRating: '8.9 IMDb',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    formats: ['IMAX 3D', 'IMAX 70mm', 'Dolby Cinema'],
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUl1MQQsGLfJ9XAwzZjsY2R2LCZJ1hUFIlAaoE-JvR3151msxexHV71UaOUyEA9Bl0cfM_HdeG9C59VpI_PVLtDbNP9kXVFaoJtPswXG1_9ZNkvNopJpXxZCmnjrX2bG63DSAxzlZxQ5fYGxBEQYoFIvd_Fnn4h_URoJw6uDF8n2rtA55vvjYAGR7XS1PYrelMJwdrfDJCbNp1n0L1sOnDHSNIfI8nLg0FyHp2gC0YS6Y-e2pWYAGXrg',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUl1MQQsGLfJ9XAwzZjsY2R2LCZJ1hUFIlAaoE-JvR3151msxexHV71UaOUyEA9Bl0cfM_HdeG9C59VpI_PVLtDbNP9kXVFaoJtPswXG1_9ZNkvNopJpXxZCmnjrX2bG63DSAxzlZxQ5fYGxBEQYoFIvd_Fnn4h_URoJw6uDF8n2rtA55vvjYAGR7XS1PYrelMJwdrfDJCbNp1n0L1sOnDHSNIfI8nLg0FyHp2gC0YS6Y-e2pWYAGXrg',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    nowShowingSlots: ['18:40', '21:15'],
  },
  {
    id: 'midnight-syndicate',
    title: 'Midnight Syndicate',
    ageRating: 'R',
    runtime: '2h 12m',
    rating: 8.4,
    imdbRating: '8.4 IMDb',
    genres: ['Action', 'Thriller', 'Crime'],
    formats: ['Dolby Vision', 'Dolby Atmos', 'RealD 3D'],
    synopsis: 'A gritty cyberpunk detective navigates the underworld of an obsidian metropolis to hunt down an elite syndicate before their viral weapon is unleashed.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXM0KJOvZB2mMjveSlau7180T8wA1ih4VjDmQOLr7qrx7iHH_tX4e4GHfnI20NzOIBdCWMj_j1ice4toG_10yk6hk4RspybH9Pj08LjOnVlmthpA7IT_-ntOg8RH_PgKUS6PLbVkcgMdQy_CqhpQnKLw9GmgfN99SBlJfKZ-qSswBBp4QP1rcJE563ihOX-vQ-McDtia3UNAgIShACbcjTqeX6jKYm7c6BSuWgp19x90jo6eKVH9JXQ',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXM0KJOvZB2mMjveSlau7180T8wA1ih4VjDmQOLr7qrx7iHH_tX4e4GHfnI20NzOIBdCWMj_j1ice4toG_10yk6hk4RspybH9Pj08LjOnVlmthpA7IT_-ntOg8RH_PgKUS6PLbVkcgMdQy_CqhpQnKLw9GmgfN99SBlJfKZ-qSswBBp4QP1rcJE563ihOX-vQ-McDtia3UNAgIShACbcjTqeX6jKYm7c6BSuWgp19x90jo6eKVH9JXQ',
    cast: ['Elyas M. Vance', 'Elena Rostova', 'Kaelen Thorne'],
    director: 'Marcus Kane',
    nowShowingSlots: ['19:30', '22:00'],
  },
  {
    id: 'phantom-resonance',
    title: 'Phantom Resonance',
    ageRating: 'PG-13',
    runtime: '1h 58m',
    rating: 7.9,
    imdbRating: '7.9 IMDb',
    genres: ['Horror', 'Mystery', 'Thriller'],
    formats: ['4DX Atmos', 'Dolby Cinema'],
    synopsis: 'In an antique secluded gothic opera hall, acoustic anomalies resurrect traumatic memories that manifest as physical specters under the single piercing spotlight.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRrPbYd2X_IM68tpb2mMMN5hB--mmOHPnBjIpoV33Qqn1ilwAff6qM0s-f1i-wVQGEyOFSwpAxiUjKZrmC5MQj4v4DZgfT_J88vnIscKqF0EBsqterLGriqbAuyf95YmyKFR-LDsJZT50zgJH6DuRHj2vOEpY9DfDY1G-ZQfzBNwbPYTZI0TGleYbhNvh3EVT38jklLCcjKmr9dYm1QhwHke0xgvmEdCs6cuxpAVn5ojBLAqTiG7eKVw',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRrPbYd2X_IM68tpb2mMMN5hB--mmOHPnBjIpoV33Qqn1ilwAff6qM0s-f1i-wVQGEyOFSwpAxiUjKZrmC5MQj4v4DZgfT_J88vnIscKqF0EBsqterLGriqbAuyf95YmyKFR-LDsJZT50zgJH6DuRHj2vOEpY9DfDY1G-ZQfzBNwbPYTZI0TGleYbhNvh3EVT38jklLCcjKmr9dYm1QhwHke0xgvmEdCs6cuxpAVn5ojBLAqTiG7eKVw',
    cast: ['Clara Montgomery', 'Julian De Vries', 'Miriam Vance'],
    director: 'Claire Fontaine',
    nowShowingSlots: ['20:15', '23:10'],
  },
  {
    id: 'gladiator-2',
    title: 'Gladiator II: Live',
    ageRating: 'R',
    runtime: '2h 28m',
    rating: 8.6,
    imdbRating: '8.6 IMDb',
    genres: ['Action', 'Drama', 'Adventure'],
    formats: ['IMAX 70mm', 'Dolby Cinema'],
    synopsis: 'Years after witnessing the death of Maximus, Lucius must enter the Colosseum after his home is conquered by tyrannical emperors.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRCHz9CqRao--aP1V3jUkME0YHjvc26I8yAsurlEvsbrlFQiTTzmEiwRmMR5p20EAMUDse29gJNgkl5SY38BjvXOHl7Y4qZSz009Y2jT8fbwptKBS9gC5ZYf9PEAMOzmXyEQvb16p2zEv4xXwpqF_A6KNHWh3iXNBOxdnuvV1Th_pksFWyrpNDTOAJoiezUpftAdwjaLmI-d5rDLVpj5SxEEWuJyGT2lOntmEB5CKB-licZYTpffNO7Q',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXM0KJOvZB2mMjveSlau7180T8wA1ih4VjDmQOLr7qrx7iHH_tX4e4GHfnI20NzOIBdCWMj_j1ice4toG_10yk6hk4RspybH9Pj08LjOnVlmthpA7IT_-ntOg8RH_PgKUS6PLbVkcgMdQy_CqhpQnKLw9GmgfN99SBlJfKZ-qSswBBp4QP1rcJE563ihOX-vQ-McDtia3UNAgIShACbcjTqeX6jKYm7c6BSuWgp19x90jo6eKVH9JXQ',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington'],
    director: 'Ridley Scott',
    nowShowingSlots: ['17:30', '20:45'],
  },
  {
    id: 'chronicles-of-nebula',
    title: 'Chronicles of Nebula',
    ageRating: 'PG-13',
    runtime: '2h 34m',
    rating: 8.7,
    imdbRating: '8.7 IMDb',
    genres: ['Sci-Fi', 'Adventure'],
    formats: ['IMAX 3D', '4DX Live'],
    synopsis: 'A deep-space expedition to the Cygnus Rift encounters an ancient megastructure constructed from stellar dust and forgotten technology.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUl1MQQsGLfJ9XAwzZjsY2R2LCZJ1hUFIlAaoE-JvR3151msxexHV71UaOUyEA9Bl0cfM_HdeG9C59VpI_PVLtDbNP9kXVFaoJtPswXG1_9ZNkvNopJpXxZCmnjrX2bG63DSAxzlZxQ5fYGxBEQYoFIvd_Fnn4h_URoJw6uDF8n2rtA55vvjYAGR7XS1PYrelMJwdrfDJCbNp1n0L1sOnDHSNIfI8nLg0FyHp2gC0YS6Y-e2pWYAGXrg',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUl1MQQsGLfJ9XAwzZjsY2R2LCZJ1hUFIlAaoE-JvR3151msxexHV71UaOUyEA9Bl0cfM_HdeG9C59VpI_PVLtDbNP9kXVFaoJtPswXG1_9ZNkvNopJpXxZCmnjrX2bG63DSAxzlZxQ5fYGxBEQYoFIvd_Fnn4h_URoJw6uDF8n2rtA55vvjYAGR7XS1PYrelMJwdrfDJCbNp1n0L1sOnDHSNIfI8nLg0FyHp2gC0YS6Y-e2pWYAGXrg',
    cast: ['Dev Patel', 'Florence Pugh', 'Cillian Murphy'],
    director: 'Denis Villeneuve',
    nowShowingSlots: ['16:00', '19:15'],
  },
];

export const UPCOMING_MOVIES: Movie[] = [
  {
    id: 'velocity-zero-meridian',
    title: 'Velocity: Zero Meridian',
    ageRating: 'PG-13',
    runtime: '2h 15m',
    rating: 8.5,
    genres: ['Action', 'Sci-Fi Thriller'],
    formats: ['IMAX 70mm', '4DX Live'],
    synopsis: 'On the suspended high-speed skyways of Neo-Kowloon, experimental hypercar pilots enter a lethal trans-atmospheric rally.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYngR19HPkhIDt7zXf2ssClqlfoGk4XLIFUo2vNtY7jpEsQ9YvPw3HK1v-Z4x0SPBU6IRr7HmU_6S32f3ValpFICjAHMUDL84YbH4qzk-Ojf1yV4mrFc22zCDqReIXdH-vN4LDV_04wkl2xq2Q4yxvXVO-F44aDWxK4RMfCoDRF5s2MSyY-9nlYjfxrAUBWM2BPDYC3Kc6R0D29AOZKf-CXg0QV-vePaPezGcg7XEPLtvZRzhiHuBNsw',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYngR19HPkhIDt7zXf2ssClqlfoGk4XLIFUo2vNtY7jpEsQ9YvPw3HK1v-Z4x0SPBU6IRr7HmU_6S32f3ValpFICjAHMUDL84YbH4qzk-Ojf1yV4mrFc22zCDqReIXdH-vN4LDV_04wkl2xq2Q4yxvXVO-F44aDWxK4RMfCoDRF5s2MSyY-9nlYjfxrAUBWM2BPDYC3Kc6R0D29AOZKf-CXg0QV-vePaPezGcg7XEPLtvZRzhiHuBNsw',
    isUpcoming: true,
    upcomingReleaseDate: 'Release Nov 24',
  },
  {
    id: 'the-sunken-odyssey',
    title: 'The Sunken Odyssey',
    ageRating: 'PG',
    runtime: '2h 20m',
    rating: 8.7,
    genres: ['Fantasy', 'Adventure'],
    formats: ['Dolby 3D', 'IMAX 3D'],
    synopsis: 'A mythical ancient golden kingdom submerged deep beneath deep midnight blue ocean waters beckons the last heir of Atlantis.',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvh9gj0RJ_v-JXDaCQ6ROiyvhuEyPuzstILho0zQlg_rktdhrlpbDCp_IyDQASk6A5Rwvvb6ySJaOaIOAylO1Bajf-3r7fYzMUeKImOXhUW6ot-vppaXvYrd6kBTrMfiHW-MjGfPHZhF5MMYtZC3i_89VB2tzfHSdPheM0ZO10yDDqmYQQTaxttpYQj7sXiXeXAjQKYFwz92blOFDpCa1JSrwVUK1qPZ65zs2-fqktZNWxwdebxy5f8A',
    posterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvh9gj0RJ_v-JXDaCQ6ROiyvhuEyPuzstILho0zQlg_rktdhrlpbDCp_IyDQASk6A5Rwvvb6ySJaOaIOAylO1Bajf-3r7fYzMUeKImOXhUW6ot-vppaXvYrd6kBTrMfiHW-MjGfPHZhF5MMYtZC3i_89VB2tzfHSdPheM0ZO10yDDqmYQQTaxttpYQj7sXiXeXAjQKYFwz92blOFDpCa1JSrwVUK1qPZ65zs2-fqktZNWxwdebxy5f8A',
    isUpcoming: true,
    upcomingReleaseDate: 'Release Dec 15',
  },
];

export const THEATRES: TheatreSchedule[] = [
  {
    id: 'starlight-imax',
    name: 'Starlight IMAX Cinema',
    distance: '1.2 miles away',
    address: 'Grand Boulevard #402, Downtown',
    badge: 'PREMIUM',
    badgeType: 'laser',
    priceRange: '$18.50 - $24.00',
    auditorium: 'Auditorium 1',
    screenName: 'Screen 1 • IMAX with Laser, Dolby 12-channel',
    amenities: {
      parking: 'Free Valet Parking',
      seating: 'Full recliner seating',
      audio: 'Dolby 12-Channel Immersive Sound',
      accessibility: 'Wheelchair Accessible & Hearing Loop',
    },
    slots: [
      { id: 'starlight-1', time: '11:30 AM', format: 'Laser 3D' },
      { id: 'starlight-2', time: '02:45 PM', format: 'Laser 3D' },
      { id: 'starlight-3', time: '06:15 PM', format: 'IMAX 3D' },
      { id: 'starlight-4', time: '09:30 PM', format: 'Laser 3D' },
    ],
  },
  {
    id: 'grand-dolby',
    name: 'Grand Dolby Cineplex',
    distance: '3.5 miles away',
    address: 'Riverfront Plaza Mall, Westside',
    badgeType: 'dolby',
    priceRange: '$16.00 - $22.50',
    auditorium: 'Auditorium 3',
    screenName: 'Screen 3 • Dolby Cinema Atmos, Recliner Seats',
    amenities: {
      food: 'In-seat Food Service',
      seating: 'Dolby Vision 4K Dual Laser Recliners',
      audio: 'Dolby Atmos Spatial Audio',
    },
    slots: [
      { id: 'dolby-1', time: '01:00 PM', format: 'Atmos 2D' },
      { id: 'dolby-2', time: '04:30 PM', format: 'Atmos 2D' },
      { id: 'dolby-3', time: '08:00 PM', format: 'Lounge' },
      { id: 'dolby-4', time: '10:45 PM', format: 'Late Night' },
    ],
  },
  {
    id: 'empire-multiplex',
    name: 'Empire Multiplex',
    distance: '4.8 miles away',
    address: 'Uptown Square #112',
    badgeType: 'standard',
    priceRange: '$14.00 - $18.00',
    auditorium: 'Auditorium 2',
    screenName: 'Screen 2 • Standard Digital 4K',
    amenities: {
      accessibility: 'Wheelchair Accessible',
      food: 'Standard Concessions & Gourmet Popcorn',
    },
    slots: [
      { id: 'empire-1', time: '12:00 PM', format: 'Digital 4K' },
      { id: 'empire-2', time: '03:15 PM', format: 'Digital 4K' },
      { id: 'empire-3', time: '07:00 PM', format: 'Digital 4K' },
    ],
  },
];

export const DATES_DATA = [
  { key: 'Oct 24', day: 'Today', date: 'Oct 24', fullDate: 'Thu, Oct 24, 2024' },
  { key: 'Oct 25', day: 'Fri', date: 'Oct 25', fullDate: 'Fri, Oct 25, 2024' },
  { key: 'Oct 26', day: 'Sat', date: 'Oct 26', fullDate: 'Sat, Oct 26, 2024' },
  { key: 'Oct 27', day: 'Sun', date: 'Oct 27', fullDate: 'Sun, Oct 27, 2024' },
  { key: 'Oct 28', day: 'Mon', date: 'Oct 28', fullDate: 'Mon, Oct 28, 2024' },
];

export const FORMAT_CHIPS = [
  { id: 'all', label: 'All Formats', icon: 'check' },
  { id: 'imax-3d', label: 'IMAX 3D', icon: 'theaters' },
  { id: 'dolby-atmos', label: 'Dolby Atmos', icon: 'surround_sound' },
  { id: 'recliner-vip', label: 'Recliner VIP', icon: 'weekend' },
];

export const HOME_FORMAT_FILTERS = [
  { id: 'imax-70', label: 'IMAX 70mm', special: true },
  { id: 'dolby-cinema', label: 'Dolby Cinema' },
  { id: '4dx-live', label: '4DX Live' },
  { id: 'reald-3d', label: 'RealD 3D' },
];

export const HOME_GENRE_FILTERS = [
  'Sci-Fi', 'Action', 'Drama', 'Horror', 'Adventure', 'Mystery'
];

// Helper to generate auditorium seats - all open and available
export function generateInitialSeats(): Seat[] {
  const seats: Seat[] = [];

  // Tier 1: Standard Seats (₹220) - Rows A, B, C, D (10 seats per row) - ALL OPEN
  const rowsTier1 = ['A', 'B', 'C', 'D'];
  rowsTier1.forEach((row) => {
    for (let num = 1; num <= 10; num++) {
      const isWheelchair = (row === 'A' && (num === 1 || num === 10));

      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        tier: 'standard',
        price: 220,
        status: 'available',
        isWheelchair,
      });
    }
  });

  // Tier 2: Premium Club (₹380) - Rows E, F (10 seats per row) - ALL OPEN
  const rowsTier2 = ['E', 'F'];
  rowsTier2.forEach((row) => {
    for (let num = 1; num <= 10; num++) {
      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        tier: 'premium',
        price: 380,
        status: 'available',
      });
    }
  });

  // Tier 3: VIP Recliner with Lounger (₹550) - Rows G, H (6 loungers per row) - ALL OPEN
  const rowsTier3 = ['G', 'H'];
  rowsTier3.forEach((row) => {
    for (let num = 1; num <= 6; num++) {
      seats.push({
        id: `${row}${num}`,
        row,
        number: num,
        tier: 'vip',
        price: 550,
        status: 'available',
        isLounger: true,
      });
    }
  });

  return seats;
}
