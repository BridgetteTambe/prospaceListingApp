import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { InputField } from '../components/Field.jsx';
import { ErrorNote } from '../components/ui.jsx';
import { validateRegister, hasErrors } from '../utils/validation.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const fieldErrors = validateRegister(form);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    setBusy(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-14">
      <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
      <p className="mt-1 mb-6 text-sm text-slate">List properties and manage your portfolio.</p>

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {serverError && <ErrorNote>{serverError}</ErrorNote>}
        <InputField label="Full name" hint="Optional" value={form.name} onChange={set('name')} autoComplete="name" />
        <InputField label="Username" value={form.username} onChange={set('username')} error={errors.username} autoComplete="username" />
        <InputField label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <InputField label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} hint="At least 6 characters" autoComplete="new-password" />
        <button disabled={busy} className="mt-1 rounded-lg bg-evergreen px-4 py-2.5 font-medium text-paper hover:bg-evergreen-700 disabled:opacity-60">
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate">
        Already have an account?{' '}
        <Link to="/login" className="text-evergreen hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
