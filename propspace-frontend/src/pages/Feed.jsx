import { useState, useEffect, useMemo } from 'react';
import { fetchProperties } from '../api/properties.js';
import useSocket from '../hooks/useSocket.js';
import FilterBar from '../components/FilterBar.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { Spinner, ErrorNote, EmptyState } from '../components/ui.jsx';

export default function Feed() {
  const [filters, setFilters] = useState({});
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // BP #1 — State Initialization:
  // Fetch runs on mount and re-runs only when `filters` change. The `active`
  // flag (BP #2) discards a response that arrives after unmount or after a
  // newer filter request superseded this one.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchProperties(filters)
      .then((res) => active && setProperties(res.items))
      .catch((err) => active && setError(err.response?.data?.message || err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [filters]);

  // BP #2 — Memory Cleanup:
  // Stable handler map (useMemo) so useSocket subscribes once. The hook removes
  // these listeners and disconnects when Feed unmounts.
  const socketHandlers = useMemo(
    () => ({
      'property:new': (p) => setProperties((prev) => [p, ...prev]),
      'property:updated': (p) =>
        setProperties((prev) => prev.map((x) => (x._id === p._id ? p : x))),
      'property:deleted': ({ id }) =>
        setProperties((prev) => prev.filter((x) => x._id !== id)),
    }),
    []
  );
  useSocket(socketHandlers);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <section className="mb-7">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Find your next space
        </h1>
        <p className="mt-1 text-slate">
          Browse every listing — updates appear live as owners post them.
        </p>
      </section>

      <div className="mb-6">
        <FilterBar onApply={setFilters} />
      </div>

      {loading ? (
        <Spinner label="Loading listings" />
      ) : error ? (
        <ErrorNote>Couldn’t load listings: {error}</ErrorNote>
      ) : properties.length === 0 ? (
        <EmptyState title="No properties match these filters" hint="Try widening your price range or clearing the city." />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
