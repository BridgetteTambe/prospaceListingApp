import { useParams, Link } from 'react-router-dom';
import { fetchProperty } from '../api/properties.js';
import useFetch from '../hooks/useFetch.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Spinner, ErrorNote } from '../components/ui.jsx';

const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  // BP #1 — fetch this listing once on mount (re-runs if the :id changes).
  const { data: property, loading, error } = useFetch(() => fetchProperty(id), [id]);

  if (loading) return <Spinner label="Loading property" />;
  if (error) return <div className="mx-auto max-w-3xl px-5 py-10"><ErrorNote>{error}</ErrorNote></div>;
  if (!property) return null;

  const isOwner = user && property.owner?._id === user._id;
  const cover = property.images?.[0];

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <Link to="/" className="text-sm text-slate hover:text-ink">← Back to listings</Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="aspect-[16/9] bg-paper">
          {cover ? (
            <img src={cover} alt={property.title} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-slate font-display">No photo</div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink">{property.title}</h1>
            <span className="font-display text-2xl text-evergreen">{money(property.price)}</span>
          </div>

          <p className="mt-1 text-slate">
            {[property.location?.address, property.location?.city, property.location?.country].filter(Boolean).join(', ')}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {[
              `For ${property.listingType}`,
              property.propertyType,
              property.bedrooms ? `${property.bedrooms} bed` : null,
              property.bathrooms ? `${property.bathrooms} bath` : null,
              property.area ? `${property.area} m²` : null,
              property.status,
            ].filter(Boolean).map((tag) => (
              <span key={tag} className="rounded-full border border-line px-3 py-1 capitalize text-slate">{tag}</span>
            ))}
          </div>

          <p className="mt-5 whitespace-pre-line leading-relaxed text-ink">{property.description}</p>

          <div className="mt-6 border-t border-line pt-4 text-sm text-slate">
            Listed by {property.owner?.name || property.owner?.username || 'a PropSpace user'}
            {property.owner?.email ? ` · ${property.owner.email}` : ''}
          </div>

          {isOwner && (
            <Link to={`/listings/${property._id}/edit`} className="mt-5 inline-block rounded-lg bg-amber px-4 py-2 text-sm font-medium text-ink hover:bg-amber-600">
              Edit this listing
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
