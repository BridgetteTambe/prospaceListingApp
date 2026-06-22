import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfileRequest, changePasswordRequest } from '../api/users.js';
import { InputField } from '../components/Field.jsx';
import { validatePasswordChange, hasErrors } from '../utils/validation.js';

function Banner({ tone, children }) {
  if (!children) return null;
  const styles =
    tone === 'error'
      ? 'border-amber-600/40 bg-amber/10 text-ink'
      : 'border-evergreen/30 bg-evergreen/5 text-evergreen';
  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

export default function AccountSettings() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileErr, setProfileErr] = useState(null);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwMsg, setPwMsg] = useState(null);
  const [pwErr, setPwErr] = useState(null);

  const setP = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));
  const setPwField = (k) => (e) => setPw((p) => ({ ...p, [k]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileErr(null);
    try {
      const updated = await updateProfileRequest(profile);
      updateUser(updated);
      setProfileMsg('Profile saved.');
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Could not save profile');
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    setPwErr(null);

    const fieldErrors = validatePasswordChange(pw);
    setPwErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    try {
      const res = await changePasswordRequest(pw);
      setPwMsg(res.message || 'Password updated.');
      setPw({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwErr(err.response?.data?.message || 'Could not update password');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink">Account settings</h1>
      <p className="mb-6 text-sm text-slate">Signed in as {user?.username} · {user?.email}</p>

      <section className="mb-8 rounded-xl border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Profile</h2>
        <form onSubmit={saveProfile} noValidate className="flex flex-col gap-4">
          <Banner tone="success">{profileMsg}</Banner>
          <Banner tone="error">{profileErr}</Banner>
          <InputField label="Display name" value={profile.name} onChange={setP('name')} />
          <InputField label="Phone" value={profile.phone} onChange={setP('phone')} />
          <InputField label="Avatar URL" value={profile.avatar} onChange={setP('avatar')} placeholder="https://…" />
          <button className="self-start rounded-lg bg-evergreen px-4 py-2 text-sm font-medium text-paper hover:bg-evergreen-700">
            Save profile
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Change password</h2>
        <form onSubmit={savePassword} noValidate className="flex flex-col gap-4">
          <Banner tone="success">{pwMsg}</Banner>
          <Banner tone="error">{pwErr}</Banner>
          <InputField
            label="Current password"
            type="password"
            value={pw.currentPassword}
            onChange={setPwField('currentPassword')}
            error={pwErrors.currentPassword}
            autoComplete="current-password"
          />
          <InputField
            label="New password"
            type="password"
            value={pw.newPassword}
            onChange={setPwField('newPassword')}
            error={pwErrors.newPassword}
            hint="At least 6 characters"
            autoComplete="new-password"
          />
          <button className="self-start rounded-lg bg-evergreen px-4 py-2 text-sm font-medium text-paper hover:bg-evergreen-700">
            Update password
          </button>
        </form>
      </section>
    </div>
  );
}
