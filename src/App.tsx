import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import AboutPage from './pages/About';
import MenuPage from './pages/Menu';
import GalleryPage from './pages/Gallery';
import ContactPage from './pages/Contact';
import CateringPage from './components/CateringPage';
import Specials from './pages/Specials';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="bg-[#0a192f] text-gray-300 font-sans min-h-screen">
      <ScrollToTop />

      {!isAdminPath && <Navbar />}

      <main className={!isAdminPath ? 'pt-20' : ''}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/specials" element={<Specials />} />
          <Route path="/catering" element={<CateringPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </BrowserRouter>
  );
}
