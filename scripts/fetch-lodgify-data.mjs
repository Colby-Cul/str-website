import { execSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const outputPath = new URL('../src/data/generated/lodgify.json', import.meta.url);
const apiBase = 'https://api.lodgify.com';
const dayMs = 24 * 60 * 60 * 1000;
const propertyConfigs = [
  { id: '533203', roomId: '599857', slug: 'graeagle-family-cabin' },
  { id: '746614', roomId: '813739', slug: 'northstar-luxury-getaway' },
];

function tryKeychainLookup() {
  const commands = [
    'security find-generic-password -s lodgify-api-key -a jarvis -w',
    'security find-generic-password -s lodgify-api-key -w',
  ];

  for (const command of commands) {
    try {
      return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
      continue;
    }
  }

  return '';
}

function cleanText(value) {
  return typeof value === 'string'
    ? value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : '';
}

function toMoney(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function ensureHttps(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  if (url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  return url;
}

function isoDate(value) {
  return value.toISOString().slice(0, 10);
}

function addDays(value, days) {
  return new Date(value.getTime() + days * dayMs);
}

function getDateRange() {
  const start = new Date();
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  return {
    startDate: isoDate(start),
    endDate: isoDate(end),
  };
}

async function fetchJson(path, apiKey, params = undefined) {
  const url = new URL(path, apiBase);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url, {
    headers: {
      'X-ApiKey': apiKey,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${url.pathname}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function flattenAmenities(amenities) {
  if (!amenities || typeof amenities !== 'object') {
    return [];
  }

  return Object.values(amenities)
    .flatMap((group) => (Array.isArray(group) ? group : []))
    .map((item) => cleanText(item?.text))
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function summarizePromotions(promotions) {
  return Array.isArray(promotions)
    ? promotions.map((promotion) => ({
        name: cleanText(promotion?.name),
        amount: toMoney(promotion?.price?.amount),
        percentage: toMoney(promotion?.price?.percentage),
        minimumStayDays: promotion?.minimum_stay_days ?? null,
        lastMinuteDays: promotion?.last_minute_days ?? null,
        earlyBookerDays: promotion?.early_booker_days ?? null,
      }))
    : [];
}

function summarizeFees(fees) {
  return Array.isArray(fees)
    ? fees.map((fee) => ({
        name: cleanText(fee?.fee_name),
        type: fee?.fee_type ?? null,
        amount: toMoney(fee?.price?.amount),
        percentage: toMoney(fee?.price?.percentage),
        rateType: fee?.price?.rate_type ?? null,
      }))
    : [];
}

function summarizeTaxes(taxes) {
  return Array.isArray(taxes)
    ? taxes.map((tax) => ({
        name: cleanText(tax?.tax_name),
        type: tax?.tax_type ?? null,
        amount: toMoney(tax?.price?.amount),
        percentage: toMoney(tax?.price?.percentage),
        rateType: tax?.price?.rate_type ?? null,
      }))
    : [];
}

function normalizePricing(rateCalendar, detail, room) {
  const calendarItems = Array.isArray(rateCalendar?.calendar_items) ? rateCalendar.calendar_items : [];
  const dailyRates = calendarItems
    .map((item) => {
      const firstPrice = Array.isArray(item?.prices) ? item.prices[0] : null;
      const pricePerDay = toMoney(firstPrice?.price_per_day);
      if (!item?.date || pricePerDay === null) {
        return null;
      }

      return {
        date: item.date,
        pricePerDay,
        minStay: firstPrice?.min_stay ?? null,
        maxStay: firstPrice?.max_stay ?? null,
      };
    })
    .filter(Boolean);

  const amounts = dailyRates.map((item) => item.pricePerDay);
  const min = amounts.length ? Math.min(...amounts) : toMoney(room?.min_price) ?? toMoney(detail?.min_price);
  const max = amounts.length ? Math.max(...amounts) : toMoney(room?.max_price) ?? toMoney(detail?.max_price);
  const avg =
    amounts.length > 0
      ? Number((amounts.reduce((total, value) => total + value, 0) / amounts.length).toFixed(2))
      : min;
  const currency = rateCalendar?.rate_settings?.currency_code ?? detail?.currency_code ?? 'USD';

  const monthlyMap = new Map();
  for (const item of dailyRates) {
    const monthKey = item.date.slice(0, 7);
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, []);
    }
    monthlyMap.get(monthKey).push(item.pricePerDay);
  }

  const seasonalPricing = Array.from(monthlyMap.entries()).map(([month, values]) => ({
    month,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: Number((values.reduce((total, value) => total + value, 0) / values.length).toFixed(2)),
  }));

  return {
    currency,
    min,
    max,
    avg,
    nightlyRange:
      min !== null && max !== null
        ? `$${Math.round(min).toLocaleString()}-$${Math.round(max).toLocaleString()}`
        : min !== null
          ? `$${Math.round(min).toLocaleString()}`
          : null,
    dailyRates,
    seasonalPricing,
    fees: summarizeFees(rateCalendar?.rate_settings?.fees),
    taxes: summarizeTaxes(rateCalendar?.rate_settings?.taxes),
    promotions: summarizePromotions(rateCalendar?.rate_settings?.promotions),
  };
}

function buildAvailabilityMap(periods, startDate, endDate) {
  const entries = {};
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    entries[isoDate(cursor)] = { available: true, bookingCount: 0 };
  }

  for (const period of periods) {
    const periodStart = new Date(`${period.start}T00:00:00Z`);
    const periodEnd = new Date(`${period.end}T00:00:00Z`);

    for (let cursor = periodStart; cursor <= periodEnd; cursor = addDays(cursor, 1)) {
      const key = isoDate(cursor);
      if (!(key in entries)) {
        continue;
      }

      entries[key] = {
        available: period.available === 1,
        bookingCount: Array.isArray(period.bookings) ? period.bookings.length : 0,
      };
    }
  }

  return entries;
}

function normalizeAvailability(availabilityResponse, startDate, endDate) {
  const propertyAvailability = Array.isArray(availabilityResponse) ? availabilityResponse[0] : null;
  const periods = Array.isArray(propertyAvailability?.periods) ? propertyAvailability.periods : [];
  const unavailableRanges = periods
    .filter((period) => period?.available === 0)
    .map((period) => ({
      start: period.start,
      end: period.end,
      bookingIds: Array.isArray(period.bookings) ? period.bookings.map((booking) => booking.id) : [],
    }));

  return {
    startDate,
    endDate,
    periods,
    unavailableRanges,
    calendar: buildAvailabilityMap(periods, startDate, endDate),
  };
}

function normalizePhotos(roomData, detail) {
  const images = Array.isArray(roomData?.images) ? roomData.images : [];
  const gallery = images
    .map((image, index) => ({
      src: ensureHttps(image?.url),
      alt: cleanText(image?.text) || `${cleanText(detail?.name) || 'Property photo'} ${index + 1}`,
    }))
    .filter((image) => image.src);

  if (gallery.length > 0) {
    return gallery;
  }

  const hero = ensureHttps(detail?.image_url);
  return hero ? [{ src: hero, alt: cleanText(detail?.name) || 'Property photo' }] : [];
}

function normalizeProperty({ config, detail, legacyDetail, roomData, rateCalendar, availability }) {
  const roomFromLegacy = Array.isArray(legacyDetail?.rooms)
    ? legacyDetail.rooms.find((room) => String(room.id) === config.roomId) ?? legacyDetail.rooms[0]
    : null;
  const room = roomData ?? roomFromLegacy ?? {};
  const pricing = normalizePricing(rateCalendar, detail, room);
  const gallery = normalizePhotos(roomData, detail);
  const amenities = flattenAmenities(roomData?.amenities);
  const availabilitySummary = availability.unavailableRanges.length
    ? `${availability.unavailableRanges.length} booked date range${availability.unavailableRanges.length === 1 ? '' : 's'} in the next 12 months`
    : 'Open availability for the next 12 months';

  return {
    id: config.id,
    roomId: config.roomId,
    slug: config.slug,
    name: cleanText(detail?.name ?? room?.name),
    description: cleanText(detail?.description ?? roomData?.description ?? legacyDetail?.description),
    address: [detail?.address, detail?.city, detail?.state, detail?.zip].filter(Boolean).join(', '),
    latitude: detail?.latitude ?? null,
    longitude: detail?.longitude ?? null,
    currency: pricing.currency,
    rates: pricing,
    bedrooms: room?.bedrooms ?? null,
    bathrooms: room?.bathrooms ?? null,
    maxGuests: room?.max_people ?? null,
    amenities,
    gallery,
    heroImage: gallery[0]?.src ?? ensureHttps(detail?.image_url),
    availability,
    availabilitySummary,
  };
}

async function fetchPropertyBundle(config, apiKey, range) {
  const [detail, legacyDetail, rooms, rateCalendar, availabilityResponse] = await Promise.all([
    fetchJson(`/v2/properties/${config.id}`, apiKey),
    fetchJson(`/v1/properties/${config.id}`, apiKey),
    fetchJson(`/v2/properties/${config.id}/rooms`, apiKey),
    fetchJson('/v2/rates/calendar', apiKey, {
      HouseId: config.id,
      RoomTypeId: config.roomId,
      StartDate: range.startDate,
      EndDate: range.endDate,
    }),
    fetchJson(`/v2/availability/${config.id}`, apiKey, {
      start: range.startDate,
      end: range.endDate,
    }),
  ]);

  const roomData = Array.isArray(rooms)
    ? rooms.find((room) => String(room.id) === config.roomId) ?? rooms[0]
    : null;

  return normalizeProperty({
    config,
    detail,
    legacyDetail,
    roomData,
    rateCalendar,
    availability: normalizeAvailability(availabilityResponse, range.startDate, range.endDate),
  });
}

async function main() {
  const apiKey = process.env.LODGIFY_API_KEY || tryKeychainLookup();
  const range = getDateRange();
  let payload = {
    generatedAt: null,
    source: 'fallback',
    range,
    properties: {},
  };

  if (apiKey) {
    try {
      const properties = await Promise.all(
        propertyConfigs.map((config) => fetchPropertyBundle(config, apiKey, range)),
      );

      payload = {
        generatedAt: new Date().toISOString(),
        source: 'lodgify-api',
        range,
        properties: Object.fromEntries(properties.map((property) => [property.id, property])),
      };
    } catch (error) {
      payload = {
        generatedAt: new Date().toISOString(),
        source: `fallback-after-error:${error.message}`,
        range,
        properties: {},
      };
    }
  }

  await mkdir(new URL('../src/data/generated/', import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
}

main();
