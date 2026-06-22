import { useState } from 'react';

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-evergreen';

// Local draft state; applies on submit so we don't refetch on every keystroke.
export default function FilterBar({ onApply }) {
  const [draft, setDraft] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    listingType: '',
    propertyType: '',
  });

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const apply = (e) => {
    e.preventDefault();
    // Strip empty values so the API only receives active filters.
    const active = Object.fromEntries(Object.entries(draft).filter(([, v]) => v !== ''));
    onApply(active);
  };

  const clear = () => {
    const empty = { city: '', minPrice: '', maxPrice: '', listingType: '', propertyType: '' };
    setDraft(empty);
    onApply({});
  };

  return (
    <form
      onSubmit={apply}
      className="grid grid-cols-2 gap-3 rounded-xl border border-line bg-surface p-4 md:grid-cols-6"
    >
      <input className={`${inputClass} col-span-2`} placeholder="City" value={draft.city} onChange={set('city')} />
      <input className={inputClass} type="number" min="0" placeholder="Min $" value={draft.minPrice} onChange={set('minPrice')} />
      <input className={inputClass} type="number" min="0" placeholder="Max $" value={draft.maxPrice} onChange={set('maxPrice')} />

      <select className={inputClass} value={draft.listingType} onChange={set('listingType')}>
        <option value="">Rent or sale</option>
        <option value="rent">For rent</option>
        <option value="sale">For sale</option>
      </select>

      <select className={inputClass} value={draft.propertyType} onChange={set('propertyType')}>
        <option value="">Any type</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
        <option value="studio">Studio</option>
      </select>

      <div className="col-span-2 flex gap-2 md:col-span-6">
        <button type="submit" className="rounded-lg bg-evergreen px-4 py-2 text-sm font-medium text-paper hover:bg-evergreen-700">
          Apply filters
        </button>
        <button type="button" onClick={clear} className="rounded-lg border border-line px-4 py-2 text-sm text-slate hover:text-ink">
          Clear
        </button>
      </div>
    </form>
  );
}
