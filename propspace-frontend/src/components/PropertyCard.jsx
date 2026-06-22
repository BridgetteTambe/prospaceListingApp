import { Link } from 'react-router-dom';

const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const TYPE_LABEL = { apartment: 'Apartment', house: 'House', studio: 'Studio' };

export default function PropertyCard({ property }) {
  const { _id, title, price, listingType, propertyType, location, images, bedrooms } = property;
  const cover = images?.[0];

  return (
    <Link
      to={`/listings/${_id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow hover:shadow-[0_8px_30px_rgba(20,24,31,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-slate">
            <span className="font-display text-sm">No photo</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-paper">
          For {listingType}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-display text-lg font-semibold text-ink">{money(price)}</span>
          <span className="text-xs uppercase tracking-wide text-slate">
            {TYPE_LABEL[propertyType] || propertyType}
          </span>
        </div>
        <h3 className="line-clamp-1 font-medium text-ink">{title}</h3>
        <p className="text-sm text-slate">
          {[location?.city, location?.country].filter(Boolean).join(', ') || 'Location not set'}
          {bedrooms ? ` · ${bedrooms} bd` : ''}
        </p>
      </div>
    </Link>
  );
}
