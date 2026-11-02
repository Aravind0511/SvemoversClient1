import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { EQUIPMENT_LIST } from './data/equipmentData';
import { INITIAL_BOOKINGS } from './data/initialBookings';
import type { EquipmentItem, Booking, ServiceItem, AppPage } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { EquipmentSection } from './components/EquipmentSection';
import { EquipmentModal } from './components/EquipmentModal';
import { BookingSection } from './components/BookingSection';
import { ServicesSection } from './components/ServicesSection';
import { WorkAndReviewsSection } from './components/WorkAndReviewsSection';
import { ContactSection } from './components/ContactSection';
import { FooterCTA } from './components/FooterCTA';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { LegalModal } from './components/LegalModal';
import { parseRoute } from './utils/routeUtils';

// Asynchronously load subpages to reduce initial bundle size and optimize LCP/TTI
const AboutPage = lazy(() => import('./components/AboutPage').then((m) => ({ default: m.AboutPage })));
const EquipmentPage = lazy(() => import('./components/EquipmentPage').then((m) => ({ default: m.EquipmentPage })));
const ServicesPage = lazy(() => import('./components/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const GalleryPage = lazy(() => import('./components/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const BookingPage = lazy(() => import('./components/BookingPage').then((m) => ({ default: m.BookingPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then((m) => ({ default: m.ContactPage })));

const PageLoadingFallback = () => (
  <div className="svem-page-loading" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div
      className="svem-spinner"
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTopColor: '#f59e0b',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  </div>
);

export function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    if (typeof window !== 'undefined') {
      return parseRoute(window.location.hash);
    }
    return 'home';
  });

  const [equipmentList] = useState<EquipmentItem[]>(EQUIPMENT_LIST);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const match = window.location.hash.match(/[?&](?:equipment|eq)=([^&]+)/);
      if (match) {
        const found = EQUIPMENT_LIST.find((e) => e.id === match[1]);
        if (found) return found.id;
      }
    }
    return 'jcb-3dx';
  });

  // Modal States
  const [activeEquipmentModal, setActiveEquipmentModal] = useState<EquipmentItem | null>(null);
  const [activeBookingConfirmation, setActiveBookingConfirmation] = useState<Booking | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('privacy')) return 'privacy';
      if (hash.includes('terms')) return 'terms';
    }
    return null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('privacy')) {
        setActiveLegalModal('privacy');
      } else if (hash.includes('terms')) {
        setActiveLegalModal('terms');
      }

      const page = parseRoute(window.location.hash);
      setCurrentPage(page);

      const match = window.location.hash.match(/[?&](?:equipment|eq)=([^&]+)/);
      if (match) {
        const found = EQUIPMENT_LIST.find((e) => e.id === match[1]);
        if (found) setSelectedEquipmentId(found.id);
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((page: AppPage, sectionId?: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      if (sectionId) {
        window.location.hash = `#${sectionId}`;
        const scrollTarget = (attempts = 0) => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else if (attempts < 6) {
            setTimeout(() => scrollTarget(attempts + 1), 60);
          }
        };
        requestAnimationFrame(() => scrollTarget());
      } else {
        window.location.hash = '#/';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.location.hash = `#/${page}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBookNow = useCallback((item: EquipmentItem) => {
    setSelectedEquipmentId(item.id);
    setActiveEquipmentModal(null);
    navigateTo('booking');
  }, [navigateTo]);

  const handleAddBooking = useCallback((newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  }, []);

  const handleBookingSuccess = useCallback((booking: Booking) => {
    setActiveBookingConfirmation(booking);
  }, []);

  const handleUpdateBooking = useCallback((updatedBooking: Booking) => {
    setActiveBookingConfirmation((prev) => (prev && prev.id === updatedBooking.id ? updatedBooking : prev));
    setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
  }, []);

  const handleSelectService = useCallback((_service: ServiceItem) => {
    navigateTo('services');
  }, [navigateTo]);

  const handleOpenLegal = useCallback((type: 'privacy' | 'terms') => {
    setActiveLegalModal(type);
  }, []);

  const handleCloseLegal = useCallback(() => {
    setActiveLegalModal(null);
  }, []);

  return (
    <div className="svem-app">
      {/* Sticky Header with Navigation and Active State across all 7 routes */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenBooking={() => navigateTo('booking')}
      />

      {/* Main Content Router with Suspense lazy loading boundary */}
      <main>
        <Suspense fallback={<PageLoadingFallback />}>
          {currentPage === 'about' && (
            <AboutPage
              onNavigate={navigateTo}
              onOpenBooking={() => navigateTo('booking')}
              onOpenLegal={handleOpenLegal}
            />
          )}

          {currentPage === 'equipment' && (
            <>
              <EquipmentPage
                equipmentList={equipmentList}
                onBookNow={handleBookNow}
                onViewDetails={(item) => setActiveEquipmentModal(item)}
                onNavigate={navigateTo}
              />
              <Footer onNavigate={navigateTo} onOpenLegal={handleOpenLegal} />
            </>
          )}

          {currentPage === 'services' && (
            <>
              <ServicesPage
                onNavigate={navigateTo}
                onSelectEquipmentToBook={(eqId) => {
                  setSelectedEquipmentId(eqId);
                }}
              />
              <Footer onNavigate={navigateTo} onOpenLegal={handleOpenLegal} />
            </>
          )}

          {currentPage === 'gallery' && (
            <>
              <GalleryPage onNavigate={navigateTo} />
              <Footer onNavigate={navigateTo} onOpenLegal={handleOpenLegal} />
            </>
          )}

          {currentPage === 'booking' && (
            <>
              <BookingPage
                equipmentList={equipmentList}
                selectedEquipmentId={selectedEquipmentId}
                onSelectEquipmentId={setSelectedEquipmentId}
                bookings={bookings}
                onAddBooking={handleAddBooking}
                onBookingSuccess={handleBookingSuccess}
                onUpdateBooking={handleUpdateBooking}
                onViewEquipmentDetails={(item) => setActiveEquipmentModal(item)}
                onNavigate={navigateTo}
              />
              <Footer onNavigate={navigateTo} onOpenLegal={handleOpenLegal} />
            </>
          )}

          {currentPage === 'contact' && (
            <>
              <ContactPage onNavigate={navigateTo} />
              <Footer onNavigate={navigateTo} onOpenLegal={handleOpenLegal} />
            </>
          )}

          {currentPage === 'home' && (
            <>
              {/* Full-width Hero Section */}
              <Hero
                onViewEquipment={() => navigateTo('equipment')}
                onBookNow={() => navigateTo('booking')}
              />

              {/* Equipment Catalogue Section */}
              <EquipmentSection
                equipmentList={equipmentList}
                onViewDetails={(item) => setActiveEquipmentModal(item)}
                onBookNow={handleBookNow}
                onViewAll={() => navigateTo('equipment')}
              />

              {/* Core Booking Section with Interactive Availability Calendar & Why Choose Us */}
              <BookingSection
                equipmentList={equipmentList}
                selectedEquipmentId={selectedEquipmentId}
                onSelectEquipmentId={setSelectedEquipmentId}
                bookings={bookings}
                onAddBooking={handleAddBooking}
                onBookingSuccess={handleBookingSuccess}
                onUpdateBooking={handleUpdateBooking}
              />

              {/* 5 Core Earth-Moving Services */}
              <ServicesSection onSelectService={handleSelectService} />

              {/* Worksite Gallery & Customer Reviews Side-by-Side */}
              <WorkAndReviewsSection />

              {/* Contact Yard Details & Message Form */}
              <ContactSection />

              {/* Dark Footer Action Bar */}
              <FooterCTA onOpenBooking={() => navigateTo('booking')} />

              {/* Complete Home Footer */}
              <Footer onNavigate={navigateTo} onOpenLegal={handleOpenLegal} />
            </>
          )}
        </Suspense>
      </main>

      {/* Floating Bottom-Right WhatsApp CTA */}
      <FloatingWhatsApp />

      {/* Dedicated Equipment Details Modal */}
      <EquipmentModal
        equipment={activeEquipmentModal}
        onClose={() => setActiveEquipmentModal(null)}
        onBookNow={handleBookNow}
      />

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        booking={activeBookingConfirmation}
        onClose={() => setActiveBookingConfirmation(null)}
      />

      {/* Legal Privacy Policy & Terms Modal */}
      <LegalModal
        type={activeLegalModal}
        onClose={handleCloseLegal}
      />
    </div>
  );
}

export default App;
