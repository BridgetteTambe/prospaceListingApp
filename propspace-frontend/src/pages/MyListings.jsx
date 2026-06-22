import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyProperties, deleteProperty } from '../api/properties.js';
import useFetch from '../hooks/useFetch.js';
import { Spinner, ErrorNote, EmptyState } from '../components/ui.jsx';

const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function MyListings() {
  // BP #1 — load the user's portfolio once on mount.
  const { data, loading, error, setData } = useFetch(fetchMyProperties, []);
  const [removingId, setRemovingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    setRemovingId(id);
    try {
      await deleteProperty(id);
      setData((prev) => prev.filter((p) => p._id !== id)); // optimistic local update
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete listing');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My listings</h1>
          <p className="text-sm text-slate">Manage the properties you’ve posted.</p>
        </div>
        <Link to="/listings/new" className="rounded-lg bg-amber px-4 py-2 text-sm font-medium text-ink hover:bg-amber-600">
          New listing
        </Link>
      </div>

      {loading ? (
        <Spinner label="Loading your listings" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : !data || data.length === 0 ? (
        <EmptyState title="You haven’t listed anything yet" hint="Create your first listing to see it here." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          {data.map((p) => (
            <div key={p._id} className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 last:border-0">
              <div className="min-w-0">
                <Link to={`/listings/${p._id}`} className="font-medium text-ink hover:text-evergreen">{p.title}</Link>
                <p className="text-sm text-slate">
                  {money(p.price)} · for {p.listingType} · <span className="capitalize">{p.status}</span>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link to={`/listings/${p._id}/edit`} className="rounded-lg border border-line px-3 py-1.5 text-sm text-slate hover:text-ink">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={removingId === p._id}
                  className="rounded-lg border border-amber-600/40 px-3 py-1.5 text-sm text-amber-600 hover:bg-amber/10 disabled:opacity-50"
                >
                  {removingId === p._id ? 'Removing…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
