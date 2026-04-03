const base = import.meta.env.BASE_URL ?? '/';

const withBase = (path) => `${base}${path.replace(/^\/+/, '')}`;

const graeagleGallery = [
  {
    title: 'Cabin Exterior',
    copy: 'A snow-dusted first impression that sets the tone for a classic Sierra stay.',
    src: withBase('images/graeagle/10KzuTAIYeLcPLAMuG6-yIpydGI27VDfF_Front Yard with Snow.jpg'),
    alt: 'Graeagle cabin exterior with snow in the front yard',
  },
  {
    title: 'Great Room',
    copy: 'Warm gathering space with layered seating and a family-ready layout.',
    src: withBase('images/graeagle/1nWVdbYwlfKaAqyH213XwqhrOSxKRc5qG_Graeagle Family Room.jpeg'),
    alt: 'Graeagle family room interior',
  },
  {
    title: 'Living Space',
    copy: 'A bright, polished interior photographed from the main seating area.',
    src: withBase('images/graeagle/1QAZdPFVVZ0hgt9c9vCe6RL-VfsHlx0un_IMG_7183.jpg'),
    alt: 'Graeagle cabin interior living space',
  },
  {
    title: 'Dining Area',
    copy: 'Open circulation between gathering, dining, and everyday family use.',
    src: withBase('images/graeagle/1Q_hXPRO1Gue4kUCN3qzfsdqJMBUPolY5_IMG_7212.jpg'),
    alt: 'Graeagle cabin dining area',
  },
  {
    title: 'Kitchen View',
    copy: 'Updated finishes and practical workspace for longer mountain weekends.',
    src: withBase('images/graeagle/1T30tH8F1lBTyGWE_7YfvALEchh6klxw7_IMG_7211.jpg'),
    alt: 'Graeagle cabin kitchen interior',
  },
  {
    title: 'Bedroom Detail',
    copy: 'Comfort-forward bedroom styling suited to slower mornings.',
    src: withBase('images/graeagle/1a3P1SjlZVKfP8o6kubKcqB7Xm7XIx9KY_IMG_7209.jpg'),
    alt: 'Graeagle cabin bedroom',
  },
  {
    title: 'Guest Room',
    copy: 'Additional sleeping space that keeps group stays flexible.',
    src: withBase('images/graeagle/1hkvpGHWqK7S_p_JA6NKp5fZrN_QqqVpF_IMG_7214.jpg'),
    alt: 'Graeagle cabin guest room',
  },
  {
    title: 'Family Suite',
    copy: 'Another angle on the home’s warm, wood-forward interior styling.',
    src: withBase('images/graeagle/1lgwFt5U8jA0PI8HonxBuo03N4XX5Ihmn_IMG_1283.jpg'),
    alt: 'Graeagle cabin suite interior',
  },
  {
    title: 'Lounge Perspective',
    copy: 'Sightline across the main living area with relaxed cabin character.',
    src: withBase('images/graeagle/1pyw4PBbd7kHamYta9qmiNFgvsKez_yVj_IMG_7234.jpg'),
    alt: 'Graeagle cabin lounge and living area',
  },
  {
    title: 'Interior Finish',
    copy: 'Clean, professionally edited photography from the property walkthrough.',
    src: withBase('images/graeagle/1x6d7abflVcWNK8kLfJbm1Xx6WBkm-MWl_IMG_7232.jpg'),
    alt: 'Graeagle cabin interior detail',
  },
];

const northstarGallery = [
  {
    title: 'Spa Deck View',
    copy: 'A panoramic outdoor vantage point ideal for apres-ski and summer evenings.',
    src: withBase('images/northstar/1-rXrFhnN1STwUtR8XYQQH920XI-zYSM4_View from spa on top deck.jpg'),
    alt: 'View from the spa deck at the Northstar property',
  },
  {
    title: 'Arrival View',
    copy: 'A polished exterior approach that frames the home’s alpine setting.',
    src: withBase('images/northstar/12P3fXiWF1NBOZ4IcT9GDeTqiIJMIov0A_210 Bitterbrush Way (1 of 48).jpg'),
    alt: 'Northstar property exterior arrival view',
  },
  {
    title: 'Front Elevation',
    copy: 'Street-side architecture with strong mountain-home presence.',
    src: withBase('images/northstar/1tVfeAAqo7TiQ8_Ka93rH7dZwicHORkuQ_210 Bitterbrush Way (2 of 48).jpg'),
    alt: 'Northstar property front elevation',
  },
  {
    title: 'Outdoor Setting',
    copy: 'A closer look at the home within its tree-lined neighborhood context.',
    src: withBase('images/northstar/1pGRuldbpqSngmnR31Y3JSMqMFncL0iZB_210 Bitterbrush Way (7 of 48).jpg'),
    alt: 'Northstar property outdoor setting',
  },
  {
    title: 'Great Room',
    copy: 'High-volume interior space designed for larger groups without losing warmth.',
    src: withBase('images/northstar/1JRAyKks0BUDmzKycFoG3ukEY-iGZyUfW_210 Bitterbrush Way (8 of 48).jpg'),
    alt: 'Northstar property great room interior',
  },
  {
    title: 'Living Area',
    copy: 'A comfortable interior perspective for ski-weekend gathering and entertaining.',
    src: withBase('images/northstar/1X7M-CzUKJCJu0Ua-BEn4BbLh4VI61JjD_210 Bitterbrush Way (14 of 48).jpg'),
    alt: 'Northstar property living area',
  },
  {
    title: 'Entertaining Space',
    copy: 'Wide-angle coverage of the main social zone inside the home.',
    src: withBase('images/northstar/1wQdMwMB_aSj6eovWQx8FgLSIQPNG9jyk_210 Bitterbrush Way (20 of 48).jpg'),
    alt: 'Northstar property interior entertaining space',
  },
  {
    title: 'Bedroom Suite',
    copy: 'One of the quieter retreat spaces within the property.',
    src: withBase('images/northstar/1l0ILnt3TGYuXLagMtomJTGXxYmbNrQGF_210 Bitterbrush Way (30 of 48).jpg'),
    alt: 'Northstar property bedroom suite',
  },
  {
    title: 'Guest Bedroom',
    copy: 'Additional sleeping space that supports larger family or group stays.',
    src: withBase('images/northstar/1lmgsQm2Lpyt4JUWincNZ4JMhZHNOjn91_210 Bitterbrush Way (31 of 48).jpg'),
    alt: 'Northstar property guest bedroom',
  },
  {
    title: 'Interior Detail',
    copy: 'Another finished interior view from the professional photo set.',
    src: withBase('images/northstar/1eK1pDIh_B4ARJ67AeUQOJvWaqJV2emtF_210 Bitterbrush Way (40 of 48).jpg'),
    alt: 'Northstar property interior detail',
  },
];

export const fallbackProperties = [
  {
    id: '533203',
    roomId: '599857',
    slug: 'graeagle-family-cabin',
    name: 'Family Cabin in Graeagle',
    shortLocation: 'Graeagle, California',
    address: '47 Shasta Trail, Graeagle, CA 96103',
    tagline: 'King Bed, EV Charging & Sierra Comfort',
    overview:
      'Designed for slow mornings and full itineraries, this Graeagle retreat balances cozy cabin texture with upgraded comforts for families and small groups.',
    description:
      'Minutes from Graeagle Meadows, the Lakes Basin, and year-round trail access, this cabin is positioned for easy Sierra days and restorative evenings by the fire.',
    rates: {
      nightlyRange: '$395-$625',
      avgNightly: 485,
      currency: 'USD',
    },
    rating: 4.9,
    reviewLabel: 'Guest favorite',
    maxGuests: 8,
    bedrooms: 3,
    bathrooms: 2,
    amenities: [
      'EV Charger',
      'King Bed',
      'WiFi',
      'Full Kitchen',
      'Fireplace',
      'Washer/Dryer',
    ],
    highlights: [
      'EV charging station on-site',
      'King bed in master',
      '15 min to Graeagle Meadows Golf',
    ],
    mapLabel: 'Graeagle map placeholder',
    theme:
      `linear-gradient(135deg, rgba(29, 39, 36, 0.78), rgba(63, 82, 74, 0.58)), url("${withBase('images/graeagle/1QAZdPFVVZ0hgt9c9vCe6RL-VfsHlx0un_IMG_7183.jpg')}") center/cover`,
    gallery: graeagleGallery,
    availabilitySummary: 'Availability updates through Lodgify booking widget.',
    airbnbUrl: 'https://www.airbnb.com/rooms/946628554074984654',
    vrboUrl: 'https://vrbo.onelink.me/ItNz/bjuzamt0',
  },
  {
    id: '746614',
    roomId: '813739',
    slug: 'northstar-luxury-getaway',
    name: 'Northstar Luxury Getaway',
    shortLocation: 'Northstar / Placer County, California',
    address: '210 Bitter Brush Way, Placer County, CA 96161',
    tagline: 'On the Golf Course • Ski-In Access • Resort Amenities',
    overview:
      'This Northstar-area home pairs refined interiors with close access to Tahoe adventure, creating a private resort feel for discerning guests.',
    description:
      'Positioned for quick access to slopes, trails, dining, and Tahoe day trips, the residence is tailored for upscale stays with space to unwind between outings.',
    rates: {
      nightlyRange: '$695-$1,295',
      avgNightly: 915,
      currency: 'USD',
    },
    rating: 5,
    reviewLabel: 'Luxury alpine stay',
    maxGuests: 10,
    bedrooms: 4,
    bathrooms: 3.5,
    amenities: [
      'Golf Course Views',
      'Ski-In Access',
      'Resort Pool',
      'Hot Tub',
      'King Bed',
      'Full Kitchen',
    ],
    highlights: [
      'On the golf course',
      'Walk to Northstar ski resort',
      'Resort pool & amenities included',
    ],
    mapLabel: 'Northstar map placeholder',
    theme:
      `linear-gradient(135deg, rgba(20, 25, 29, 0.74), rgba(54, 66, 77, 0.52)), url("${withBase('images/northstar/1-rXrFhnN1STwUtR8XYQQH920XI-zYSM4_View from spa on top deck.jpg')}") center/cover`,
    gallery: northstarGallery,
    availabilitySummary: 'Availability updates through Lodgify booking widget.',
    airbnbUrl: 'https://www.airbnb.com/rooms/1573420782945249337',
    vrboUrl: 'https://vrbo.onelink.me/ItNz/ilorvfkq',
  },
];
