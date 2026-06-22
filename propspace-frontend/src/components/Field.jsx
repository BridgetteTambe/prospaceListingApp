// Reusable form controls — one consistent look + error display for every form.
const base =
  'w-full rounded-lg border bg-surface px-3 py-2.5 text-ink outline-none transition-colors';
const ok = 'border-line focus:border-evergreen';
const bad = 'border-amber-600 focus:border-amber-600';

function Label({ label, children }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-ink">{label}</span>}
      {children}
    </label>
  );
}

function Note({ error, hint }) {
  if (error) return <span className="mt-1 block text-xs text-amber-600">{error}</span>;
  if (hint) return <span className="mt-1 block text-xs text-slate">{hint}</span>;
  return null;
}

export function InputField({ label, error, hint, className = '', ...props }) {
  return (
    <Label label={label}>
      <input className={`${base} ${error ? bad : ok} ${className}`} aria-invalid={!!error} {...props} />
      <Note error={error} hint={hint} />
    </Label>
  );
}

export function TextAreaField({ label, error, hint, className = '', ...props }) {
  return (
    <Label label={label}>
      <textarea className={`${base} ${error ? bad : ok} ${className}`} aria-invalid={!!error} {...props} />
      <Note error={error} hint={hint} />
    </Label>
  );
}

export function SelectField({ label, error, hint, className = '', children, ...props }) {
  return (
    <Label label={label}>
      <select className={`${base} ${error ? bad : ok} ${className}`} aria-invalid={!!error} {...props}>
        {children}
      </select>
      <Note error={error} hint={hint} />
    </Label>
  );
}
