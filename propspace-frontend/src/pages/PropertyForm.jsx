import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProperty, createProperty, updateProperty } from '../api/properties.js';
import { InputField, SelectField, TextAreaField } from '../components/Field.jsx';
import { ErrorNote, Spinner } from '../components/ui.jsx';
import { validateProperty, hasErrors } from '../utils/validation.js';

const EMPTY = {
  title: '', description: '', price: '', listingType: 'rent', propertyType: 'apartment',
  bedrooms: '', bathrooms: '', area: '',
  location: { address: '', city: '', state: '', country: '' },
  images: '', status: 'available',
};

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [busy, setBusy] = useState(false);

  // BP #1 — load existing listing once on mount when editing.
  // BP #2 — `active` guard prevents state writes after unmount.
  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    setLoading(true);
    fetchProperty(id)
      .then((p) => {
        if (!active) return;
        setForm({
          title: p.title || '',
          description: p.description || '',
          price: p.price ?? '',
          listingType: p.listingType || 'rent',
          propertyType: p.propertyType || 'apartment',
          bedrooms: p.bedrooms ?? '',
          bathrooms: p.bathrooms ?? '',
          area: p.area ?? '',
          location: {
            address: p.location?.address || '',
            city: p.location?.city || '',
            state: p.location?.state || '',
            country: p.location?.country || '',
          },
          images: (p.images || []).join(', '),
          status: p.status || 'available',
        });
      })
      .catch((err) => active && setLoadError(err.response?.data?.message || err.message))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [id, isEdit]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setLoc = (k) => (e) =>
    setForm((f) => ({ ...f, location: { ...f.location, [k]: e.target.value } }));

  const submit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // Validate before the network call.
    const fieldErrors = validateProperty(form);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: form.area ? Number(form.area) : undefined,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
    };

    setBusy(true);
    try {
      const saved = isEdit ? await updateProperty(id, payload) : await createProperty(payload);
      navigate(`/listings/${saved._id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not save listing');
      setBusy(false);
    }
  };

  if (loading) return <Spinner label="Loading listing" />;
  if (loadError) return <div className="mx-auto max-w-2xl px-5 py-10"><ErrorNote>{loadError}</ErrorNote></div>;

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        {isEdit ? 'Edit listing' : 'New listing'}
      </h1>

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {serverError && <ErrorNote>{serverError}</ErrorNote>}

        <InputField label="Title" value={form.title} onChange={set('title')} error={errors.title} />
        <TextAreaField label="Description" className="min-h-28" value={form.description} onChange={set('description')} error={errors.description} />

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Price (USD)" type="number" min="0" value={form.price} onChange={set('price')} error={errors.price} />
          <SelectField label="Listing" value={form.listingType} onChange={set('listingType')}>
            <option value="rent">For rent</option>
            <option value="sale">For sale</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <SelectField label="Type" value={form.propertyType} onChange={set('propertyType')}>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
          </SelectField>
          <InputField label="Bedrooms" type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} error={errors.bedrooms} />
          <InputField label="Bathrooms" type="number" min="0" value={form.bathrooms} onChange={set('bathrooms')} error={errors.bathrooms} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="City" value={form.location.city} onChange={setLoc('city')} />
          <InputField label="Country" value={form.location.country} onChange={setLoc('country')} />
        </div>

        <InputField
          label="Image URLs"
          hint="Comma-separated http(s) links"
          value={form.images}
          onChange={set('images')}
          error={errors.images}
          placeholder="https://… , https://…"
        />

        {isEdit && (
          <SelectField label="Status" value={form.status} onChange={set('status')}>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </SelectField>
        )}

        <button disabled={busy} className="mt-2 rounded-lg bg-evergreen px-4 py-2.5 font-medium text-paper hover:bg-evergreen-700 disabled:opacity-60">
          {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
}
