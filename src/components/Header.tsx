import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { BUSINESS_INFO, getCallUrl } from '../config/businessInfo';
import type { AppPage } from '../types';

interface HeaderProps {
  currentPage?: AppPage;
  onNavigate?: (page: AppPage, sectionId?: string) => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage = 'home',
  onNavigate,
  onOpenBooking,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background body scrolling when mobile drawer menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks: { name: string; href: string; page: AppPage; sectionId?: string }[] = [
    { name: 'Home', href: '#/', page: 'home' },
    { name: 'About Us', href: '#/about', page: 'about' },
    { name: 'Equipment', href: '#/equipment', page: 'equipment' },
    { name: 'Services', href: '#/services', page: 'services' },
    { name: 'Gallery', href: '#/gallery', page: 'gallery' },
    { name: 'Booking', href: '#/booking', page: 'booking' },
    { name: 'Contact Us', href: '#/contact', page: 'contact' },
  ];

  const handleNavClick = (
    e: React.MouseEvent,
    link: (typeof navLinks)[number]
  ) => {
    setMobileMenuOpen(false);

    if (onNavigate) {
      e.preventDefault();
      onNavigate(link.page, link.sectionId);
    }
  };

  return (
    <header className={`svem-header ${isScrolled ? 'svem-header-scrolled' : ''}`}>
      <div className="svem-header-container">
        {/* Left: Brand Logo & Name */}
        <Logo
          size="md"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate('home');
            }
          }}
        />

        {/* Center: Desktop Navigation Links */}
        <nav className="svem-nav-desktop" aria-label="Main Navigation">
          <ul className="svem-nav-list">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;

              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`svem-nav-link ${isActive ? 'svem-nav-link-active' : ''}`}
                    onClick={(e) => handleNavClick(e, link)}
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right: Phone Action & Get a Quote / Book Now CTA */}
        <div className="svem-header-actions">
          {/* Yellow Phone Icon Button (Exact Template Design) */}
          <a
            href={getCallUrl()}
            className="svem-header-phone-btn"
            title={`Call Owner: ${BUSINESS_INFO.phone}`}
            aria-label={`Call Owner at ${BUSINESS_INFO.phone}`}
          >
            <Phone size={18} />
          </a>

          {/* Primary CTA */}
          <button
            type="button"
            className="svem-btn-primary svem-btn-quote"
            onClick={onOpenBooking}
          >
            <span>Get a Quote</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="svem-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <nav
        className={`svem-mobile-drawer ${mobileMenuOpen ? 'svem-mobile-drawer-open' : ''}`}
        aria-label="Mobile Main Navigation"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="svem-mobile-drawer-inner">
          <div className="svem-mobile-nav-links">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`svem-mobile-nav-link ${isActive ? 'svem-mobile-nav-link-active' : ''}`}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="svem-mobile-drawer-ctas">
            <a
              href={getCallUrl()}
              className="svem-btn-mobile-call"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone size={18} />
              <span>Call Owner ({BUSINESS_INFO.phone})</span>
            </a>

            <button
              type="button"
              className="svem-btn-primary svem-btn-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
            >
              <span>Book Equipment Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="svem-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};
