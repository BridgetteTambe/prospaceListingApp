import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { InputField } from '../components/Field.jsx';
import { ErrorNote } from '../components/ui.jsx';
import { validateLogin, hasErrors } from '../utils/validation.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // Validate before the network call.
    const fieldErrors = validateLogin(form);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    setBusy(true);
    try {
      await login(form);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-14">
      <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 mb-6 text-sm text-slate">Sign in with your email or username.</p>

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {serverError && <ErrorNote>{serverError}</ErrorNote>}
        <InputField
          label="Email or username"
          value={form.identifier}
          onChange={set('identifier')}
          error={errors.identifier}
          autoComplete="username"
        />
        <InputField
          label="Password"
          type="password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete="current-password"
        />
        <button disabled={busy} className="mt-1 rounded-lg bg-evergreen px-4 py-2.5 font-medium text-paper hover:bg-evergreen-700 disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate">
        New here?{' '}
        <Link to="/register" className="text-evergreen hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
