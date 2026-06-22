import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Feed from './pages/Feed.jsx';
import PropertyDetail from './pages/PropertyDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyListings from './pages/MyListings.jsx';
import PropertyForm from './pages/PropertyForm.jsx';
import AccountSettings from './pages/AccountSettings.jsx';

export default function App() {
  return (
    <div className="min-h-full">
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Feed />} />
          <Route path="/listings/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/listings/new" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
          <Route path="/listings/:id/edit" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />

          <Route path="*" element={<div className="mx-auto max-w-2xl px-5 py-20 text-center font-display text-xl text-slate">Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}
