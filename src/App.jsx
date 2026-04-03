import { useEffect, useMemo, useState } from 'react';
import generatedData from './data/generated/lodgify.json';
import { fallbackProperties } from './data/fallback';

const navItems = [
  { label: 'Home', href: '#/' },
  { label: 'Properties', href: '#/properties' },
  { label: 'About', href: '#/about' },
];

const propertyPathMap = {
  '/properties/graeagle-family-cabin': '533203',
  '/properties/northstar-luxury-getaway': '746614',
};

function mergePropertyData(property) {
  const live = generatedData.properties?.[property.id];
  if (!live) {
    return property;
  }

  return {
    ...property,
    name: live.name || property.name,
    description: live.description || property.description,
    address: live.address || property.address,
    maxGuests: live.maxGuests || property.maxGuests,
    bedrooms: live.bedrooms || property.bedrooms,
    bathrooms: live.bathrooms || property.bathrooms,
    amenities: live.amenities?.length ? live.amenities : property.amenities,
    gallery:
      property.gallery?.length
        ? property.gallery
        : live.gallery?.length
          ? live.gallery.map((image) => ({
              title: image.alt || 'Property photo',
              copy: image.alt || 'Live property photography synced from Lodgify.',
              src: image.src,
              alt: image.alt || 'Property photo',
            }))
          : property.gallery,
    rates: {
      ...property.rates,
      nightlyRange: live.rates?.nightlyRange || property.rates.nightlyRange,
      avgNightly: live.rates?.avg || property.rates.avgNightly,
      currency: live.rates?.currency || property.rates.currency,
      min: live.rates?.min ?? property.rates.min,
      max: live.rates?.max ?? property.rates.max,
      seasonalPricing: live.rates?.seasonalPricing ?? [],
    },
    availabilitySummary: live.availabilitySummary || property.availabilitySummary,
    liveAvailability: live.availability || null,
    heroImage: live.heroImage || null,
  };
}

function refreshBookingScript() {
  const existing = document.querySelector('script[data-lodgify-script="true"]');
  if (existing) {
    existing.remove();
  }

  const script = document.createElement('script');
  script.src = 'https://d3sn4z8h2vn7op.cloudfront.net/websites/lodgify-booking-widget.js';
  script.async = true;
  script.dataset.lodgifyScript = 'true';
  document.body.appendChild(script);
}

function useHashRoute() {
  const getPath = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  };

  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onHashChange = () => setPath(getPath());
    window.addEventListener('hashchange', onHashChange);
    if (!window.location.hash) {
      window.location.hash = '/';
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return path;
}

function App() {
  const path = useHashRoute();
  const properties = useMemo(() => fallbackProperties.map(mergePropertyData), []);
  const currentPropertyId = propertyPathMap[path];
  const currentProperty = properties.find((property) => property.id === currentPropertyId);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)]">
      <SiteShell properties={properties}>
        {path === '/' && <HomePage properties={properties} />}
        {path === '/properties' && <PropertiesPage properties={properties} />}
        {currentProperty && <PropertyPage property={currentProperty} />}
        {path === '/about' && <AboutPage />}
        {!['/', '/properties', '/about', ...Object.keys(propertyPathMap)].includes(path) && (
          <NotFoundPage />
        )}
      </SiteShell>
    </div>
  );
}

function SiteShell({ children, properties }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(16,18,20,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#/" className="font-heading text-2xl text-[var(--color-paper)]">
            Pineside Cabins
          </a>
          <nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.22em] text-[var(--color-mist)] md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <a href={`#/properties/${properties[1].slug}`} className="button-secondary hidden md:inline-flex">
            Book Northstar
          </a>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-[var(--color-line)] bg-[var(--color-forest)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 text-sm text-[var(--color-mist)] sm:px-8 md:grid-cols-3">
          <div>
            <p className="font-heading text-2xl text-white">Pineside Cabins</p>
            <p className="mt-3 max-w-xs">
              Elevated mountain stays in Graeagle and Northstar, curated for slower mornings and better weekends.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">Properties</p>
            {properties.map((property) => (
              <a key={property.id} href={`#/properties/${property.slug}`} className="mt-3 block hover:text-white">
                {property.name}
              </a>
            ))}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">Booking</p>
            <p className="mt-3">Direct booking is powered by Lodgify for secure pricing and live availability.</p>
            <a href="#/about" className="mt-3 inline-block hover:text-white">
              Contact the host
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

function HomePage({ properties }) {
  return (
    <>
      <section className="hero-panel relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,168,106,0.35),transparent_34%),linear-gradient(135deg,rgba(14,16,18,0.92),rgba(26,34,33,0.72),rgba(60,73,79,0.44))]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow">Luxury Sierra Retreats</p>
            <h1 className="mt-5 max-w-3xl font-heading text-5xl leading-none text-white sm:text-6xl lg:text-7xl">
              Escape to the Sierra
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[var(--color-mist)] sm:text-xl">
              Two distinct mountain stays, one refined booking experience. Discover a family-ready cabin in Graeagle and an elevated alpine retreat near Northstar.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={`#/properties/${properties[0].slug}`} className="button-primary">
                Explore Graeagle
              </a>
              <a href={`#/properties/${properties[1].slug}`} className="button-secondary">
                Explore Northstar
              </a>
            </div>
          </div>
          <div className="glass-panel">
            <p className="eyebrow">Check Availability</p>
            <p className="mt-3 text-sm text-[var(--color-mist)]">
              Search both properties from one place, then move directly into live Lodgify availability and pricing.
            </p>
            <div className="mt-6">
              <SearchWidget />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-18 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-[var(--color-bronze)]">Our Collection</p>
            <h2 className="section-title">Mountain homes with a resort sensibility</h2>
          </div>
          <a href="#/properties" className="text-sm uppercase tracking-[0.22em] text-[var(--color-slate)] transition hover:text-[var(--color-forest)]">
            View all properties
          </a>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--color-line)] bg-[var(--color-paper)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-3">
          {[
            ['Direct booking', 'Secure Lodgify checkout, live pricing, and reservation management.'],
            ['Luxury tone', 'A tailored brand feel designed to position both homes above commodity rental listings.'],
            ['Mobile-first', 'Responsive layouts, compact interactions, and light asset weight for faster browsing.'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-7 shadow-[0_20px_60px_rgba(16,18,20,0.06)]">
              <p className="font-heading text-2xl text-[var(--color-forest)]">{title}</p>
              <p className="mt-3 text-[var(--color-slate)]">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function PropertiesPage({ properties }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow text-[var(--color-bronze)]">Properties</p>
        <h1 className="section-title">Choose the Sierra stay that fits your pace</h1>
        <p className="mt-4 text-lg text-[var(--color-slate)]">
          Both homes are designed for direct booking through Lodgify, with live rates and availability surfaced at the property level.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} detailed />
        ))}
      </div>
    </section>
  );
}

function PropertyCard({ property, detailed = false }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/40 bg-white shadow-[0_22px_70px_rgba(11,17,20,0.08)]">
      <div className="min-h-[320px] p-7 text-white" style={{ background: property.theme }}>
        <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/12 bg-black/10 p-6 backdrop-blur-[2px]">
          <div>
            <p className="eyebrow text-[var(--color-accent)]">{property.shortLocation}</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight">{property.name}</h2>
            <p className="mt-4 max-w-md text-[15px] text-[rgba(242,238,232,0.88)]">{property.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="pill">{property.rates.nightlyRange} / night</span>
            <span className="pill">{property.rating.toFixed(1)} stars</span>
            <span className="pill">{property.reviewLabel}</span>
          </div>
        </div>
      </div>
      <div className="space-y-6 p-7">
        <div className="grid gap-3 text-sm text-[var(--color-slate)] sm:grid-cols-3">
          <Stat label="Guests" value={property.maxGuests} />
          <Stat label="Bedrooms" value={property.bedrooms} />
          <Stat label="Baths" value={property.bathrooms} />
        </div>
        <p className="text-[var(--color-slate)]">{detailed ? property.description : property.overview}</p>
        <div className="flex flex-wrap gap-3">
          <a href={`#/properties/${property.slug}`} className="button-primary">
            View property
          </a>
          <a href="#/about" className="button-secondary">
            Contact host
          </a>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-[var(--color-paper)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.24em]">{label}</p>
      <p className="mt-2 text-lg font-medium text-[var(--color-forest)]">{value}</p>
    </div>
  );
}

function PropertyPage({ property }) {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0" style={{ background: property.theme }} />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(11,17,20,0.84),rgba(11,17,20,0.28))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-18 sm:px-8 lg:grid-cols-[1fr_360px] lg:py-22">
          <div className="max-w-3xl text-white">
            <p className="eyebrow">{property.shortLocation}</p>
            <h1 className="mt-5 font-heading text-5xl leading-none sm:text-6xl">{property.name}</h1>
            <p className="mt-5 max-w-2xl text-lg text-[var(--color-mist)]">{property.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="pill">{property.rates.nightlyRange} / night</span>
              <span className="pill">{property.rating.toFixed(1)} stars</span>
              <span className="pill">{property.maxGuests} guests</span>
            </div>
          </div>
          <div className="glass-panel lg:mt-10">
            <p className="eyebrow">Stay Snapshot</p>
            <dl className="mt-5 space-y-4 text-sm text-[var(--color-mist)]">
              <DataRow label="Address" value={property.address} />
              <DataRow label="Bedrooms" value={property.bedrooms} />
              <DataRow label="Bathrooms" value={property.bathrooms} />
              <DataRow label="Availability" value={property.availabilitySummary} />
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="eyebrow text-[var(--color-bronze)]">Property Details</p>
          <h2 className="section-title">Property photos, rates, and availability in one place</h2>
          <PhotoGallery property={property} />
          <AvailabilityCalendar property={property} />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-7 shadow-[0_20px_60px_rgba(16,18,20,0.05)]">
              <p className="font-heading text-3xl text-[var(--color-forest)]">Amenities</p>
              <ul className="mt-5 grid gap-3 text-[var(--color-slate)] sm:grid-cols-2">
                {property.amenities.map((item) => (
                  <li key={item} className="rounded-2xl bg-[var(--color-paper)] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-forest)] p-7 text-[var(--color-mist)] shadow-[0_20px_60px_rgba(16,18,20,0.08)]">
              <p className="font-heading text-3xl text-white">Nearby Highlights</p>
              <ul className="mt-5 space-y-3">
                {property.highlights.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 rounded-[2rem] border border-dashed border-[var(--color-line)] bg-[linear-gradient(180deg,#f8f5ed,#f0ebdf)] p-7">
            <p className="eyebrow text-[var(--color-bronze)]">Map</p>
            <p className="mt-3 font-heading text-3xl text-[var(--color-forest)]">{property.mapLabel}</p>
            <p className="mt-3 max-w-2xl text-[var(--color-slate)]">
              Reserved for a production map embed or static map asset showing local orientation, landmark access, and nearby recreation.
            </p>
            <div className="mt-6 h-64 rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(48,65,61,0.18),rgba(196,168,106,0.18))]" />
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-7 shadow-[0_22px_70px_rgba(11,17,20,0.08)]">
            <p className="eyebrow text-[var(--color-bronze)]">Nightly Pricing</p>
            <p className="mt-3 font-heading text-4xl text-[var(--color-forest)]">{property.rates.nightlyRange}</p>
            <p className="mt-2 text-sm text-[var(--color-slate)]">
              Average nightly rate: {formatCurrency(property.rates.avgNightly, property.rates.currency)}
            </p>
            <div className="mt-5 space-y-3">
              {property.rates.seasonalPricing?.slice(0, 4).map((entry) => (
                <div
                  key={entry.month}
                  className="flex items-center justify-between rounded-2xl bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-slate)]"
                >
                  <span>{formatMonth(entry.month)}</span>
                  <span>
                    {formatCurrency(entry.min, property.rates.currency)}-{formatCurrency(entry.max, property.rates.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-7 shadow-[0_22px_70px_rgba(11,17,20,0.08)]">
            <p className="eyebrow text-[var(--color-bronze)]">Book Direct</p>
            <p className="mt-3 text-sm text-[var(--color-slate)]">
              Live rates and availability are surfaced directly from Lodgify.
            </p>
            <div className="mt-5">
              <BookingWidget propertyId={property.id} />
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

function DataRow({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent)]">{label}</dt>
      <dd className="mt-1 text-white">{value}</dd>
    </div>
  );
}

function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-[var(--color-forest)] p-8 text-[var(--color-mist)] shadow-[0_24px_80px_rgba(14,16,18,0.14)]">
          <p className="eyebrow">About the Host</p>
          <h1 className="mt-4 font-heading text-5xl leading-none text-white">Thoughtful mountain stays, intentionally hosted</h1>
          <p className="mt-6 text-base">
            Colby Culbertson&apos;s hosting approach centers on polished homes, clear communication, and an experience that feels more like a private club stay than a standard rental handoff.
          </p>
          <p className="mt-4 text-base">
            This section is ready for a final host biography, professional portrait, and any brand story you want guests to connect with before booking.
          </p>
        </div>
        <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-8 shadow-[0_20px_60px_rgba(16,18,20,0.06)]">
          <p className="eyebrow text-[var(--color-bronze)]">Contact</p>
          <h2 className="mt-4 font-heading text-4xl text-[var(--color-forest)]">Start the conversation</h2>
          <p className="mt-4 max-w-2xl text-[var(--color-slate)]">
            Static placeholder form for now. Wire this to a form backend or host email workflow when ready.
          </p>
          <form className="mt-8 grid gap-4">
            <input className="form-input" type="text" placeholder="Full name" />
            <input className="form-input" type="email" placeholder="Email address" />
            <select className="form-input" defaultValue="">
              <option value="" disabled>
                Property of interest
              </option>
              <option>Graeagle Family Cabin</option>
              <option>Northstar Luxury Getaway</option>
              <option>Not sure yet</option>
            </select>
            <textarea className="form-input min-h-36" placeholder="Tell us about your trip" />
            <button type="button" className="button-primary w-fit">
              Placeholder submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="rounded-[2rem] border border-[var(--color-line)] bg-white p-10 text-center shadow-[0_20px_60px_rgba(16,18,20,0.05)]">
        <p className="eyebrow text-[var(--color-bronze)]">Not Found</p>
        <h1 className="mt-4 font-heading text-5xl text-[var(--color-forest)]">That page doesn&apos;t exist</h1>
        <a href="#/" className="button-primary mx-auto mt-8 inline-flex">
          Return home
        </a>
      </div>
    </section>
  );
}

function SearchWidget() {
  useEffect(() => {
    refreshBookingScript();
  }, []);

  return (
    <div
      className="lodgify-search-widget min-h-20 rounded-[1.5rem] bg-white p-4"
      data-website-id="486498"
      data-type="all"
      data-currency="USD"
    />
  );
}

function BookingWidget({ propertyId }) {
  useEffect(() => {
    refreshBookingScript();
  }, []);

  return (
    <div
      className="lodgify-widget min-h-24 rounded-[1.5rem] bg-[var(--color-paper)] p-4"
      data-website-id="486498"
      data-rental-id={propertyId}
      data-currency="USD"
    />
  );
}

function PhotoGallery({ property }) {
  const [featured, ...gallery] = property.gallery;

  if (!featured) {
    return null;
  }

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <figure className="overflow-hidden rounded-[1.75rem] border border-[var(--color-line)] bg-white shadow-[0_18px_45px_rgba(17,22,28,0.06)] md:col-span-2">
        {featured.src ? (
          <img
            src={featured.src}
            alt={featured.alt ?? featured.title}
            className="h-80 w-full object-cover sm:h-96"
            loading="eager"
          />
        ) : (
          <div className="h-80 bg-[linear-gradient(135deg,rgba(32,43,41,0.14),rgba(196,168,106,0.18))] sm:h-96" />
        )}
        <figcaption className="p-5">
          <p className="font-heading text-2xl text-[var(--color-forest)]">{featured.title}</p>
          <p className="mt-2 text-sm text-[var(--color-slate)]">{featured.copy}</p>
        </figcaption>
      </figure>
      {gallery.map((item, index) => (
        <figure
          key={`${item.src ?? item.title}-${index}`}
          className="overflow-hidden rounded-[1.75rem] border border-[var(--color-line)] bg-white shadow-[0_18px_45px_rgba(17,22,28,0.06)]"
        >
          {item.src ? (
            <img src={item.src} alt={item.alt ?? item.title} className="h-64 w-full object-cover" loading="lazy" />
          ) : (
            <div className="h-64 bg-[linear-gradient(135deg,rgba(32,43,41,0.14),rgba(196,168,106,0.18))]" />
          )}
          <figcaption className="p-5">
            <p className="font-heading text-2xl text-[var(--color-forest)]">{item.title}</p>
            <p className="mt-2 text-sm text-[var(--color-slate)]">{item.copy}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function AvailabilityCalendar({ property }) {
  const months = useMemo(() => buildCalendarMonths(property.liveAvailability?.calendar, 3), [property.liveAvailability]);
  if (!months.length) {
    return null;
  }

  return (
    <section className="mt-10 rounded-[2rem] border border-[var(--color-line)] bg-white p-7 shadow-[0_20px_60px_rgba(16,18,20,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-heading text-3xl text-[var(--color-forest)]">Availability Calendar</p>
          <p className="mt-2 text-sm text-[var(--color-slate)]">{property.availabilitySummary}</p>
        </div>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-[var(--color-slate)]">
          <LegendSwatch className="bg-[var(--color-forest)]" label="Available" />
          <LegendSwatch className="bg-[var(--color-accent)]" label="Booked" />
          <LegendSwatch className="bg-[var(--color-paper)] border border-[var(--color-line)]" label="Outside month" />
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {months.map((month) => (
          <div key={month.label} className="rounded-[1.5rem] bg-[var(--color-paper)] p-4">
            <div className="flex items-center justify-between">
              <p className="font-heading text-2xl text-[var(--color-forest)]">{month.label}</p>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-slate)]">
                {month.availableCount} open
              </p>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.2em] text-[var(--color-slate)]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {month.days.map((day, index) => (
                <div
                  key={`${month.label}-${index}`}
                  className={`flex aspect-square items-center justify-center rounded-xl text-sm font-medium ${
                    day.inMonth
                      ? day.available
                        ? 'bg-[var(--color-forest)] text-white'
                        : 'bg-[var(--color-accent)] text-[var(--color-forest)]'
                      : 'bg-white/60 text-[var(--color-slate)]'
                  }`}
                >
                  {day.dayNumber}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LegendSwatch({ className, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${className}`} />
      <span>{label}</span>
    </span>
  );
}

function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return 'Unavailable';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function buildCalendarMonths(calendar, count) {
  if (!calendar) {
    return [];
  }

  const today = new Date();
  return Array.from({ length: count }, (_, index) => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() + index, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const leadingDays = firstDayOfMonth.getDay();
    const totalCells = Math.ceil((leadingDays + lastDayOfMonth.getDate()) / 7) * 7;
    const days = [];
    let availableCount = 0;

    for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
      const date = new Date(year, month, cellIndex - leadingDays + 1);
      const iso = date.toISOString().slice(0, 10);
      const status = calendar[iso];
      const inMonth = date.getMonth() === month;
      const available = inMonth ? status?.available !== false : false;
      if (inMonth && available) {
        availableCount += 1;
      }

      days.push({
        dayNumber: date.getDate(),
        inMonth,
        available,
      });
    }

    return {
      label: monthDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      availableCount,
      days,
    };
  });
}

export default App;
