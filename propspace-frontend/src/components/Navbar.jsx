import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors ${isActive ? 'text-evergreen' : 'text-slate hover:text-ink'}`;

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-evergreen text-paper">
            <span className="font-display text-sm font-bold">P</span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Prop<span className="text-evergreen">Space</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          <NavLink to="/" end className={linkClass}>
            Browse
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                My listings
              </NavLink>
              <NavLink to="/settings" className={linkClass}>
                Settings
              </NavLink>
              <Link
                to="/listings/new"
                className="rounded-lg bg-amber px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-amber-600"
              >
                List a property
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-slate transition-colors hover:text-ink"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Sign in
              </NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-evergreen px-3 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-evergreen-700"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
