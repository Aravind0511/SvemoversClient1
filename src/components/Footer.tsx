import React from 'react';
import { ArrowUp, MapPin, Phone, Mail, Clock, Code2, Globe } from 'lucide-react';
import { Logo } from './Logo';
import { BUSINESS_INFO, getCallUrl } from '../config/businessInfo';
import type { AppPage } from '../types';

interface FooterProps {
  onNavigate?: (page: AppPage, sectionId?: string) => void;
  onOpenLegal?: (type: 'privacy' | 'terms') => void;
}

const CURRENT_YEAR = 2026;

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="svem-footer" aria-label="Site Footer">
      <div className="svem-container">
        {/* Main 4-Column Grid */}
        <div className="svem-footer-main">
          {/* Col 1: Brand Info */}
          <div className="svem-footer-col svem-footer-col-brand">
            <Logo
              variant="light"
              size="lg"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('home');
                }
              }}
            />
            <p className="svem-footer-desc">
              Premier earth-moving equipment and heavy construction vehicle rentals in South India. Well-maintained fleet, seasoned operators, and dependable project execution.
            </p>
            <div className="svem-footer-reg-pill">
              <span>Verified Heavy Equipment Fleet Operator</span>
            </div>

            {/* Coverage States with Proper Styled Badges */}
            <div className="svem-footer-states-wrap">
              <span className="svem-footer-states-label">
                Service Coverage States
              </span>
              <div className="svem-footer-states-chips">
                {BUSINESS_INFO.serviceStates.map((st) => (
                  <span key={st} className="svem-footer-state-chip">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="svem-footer-col">
            <h4 className="svem-footer-heading">Quick Navigation</h4>
            <ul className="svem-footer-links">
              <li>
                <a
                  href="#/"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('home');
                    }
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#/about"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('about');
                    }
                  }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  Our Equipment
                </a>
              </li>
              <li>
                <a
                  href="#/booking"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('booking');
                    }
                  }}
                >
                  Book Equipment
                </a>
              </li>
              <li>
                <a
                  href="#/services"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('services');
                    }
                  }}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#/gallery"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('gallery');
                    }
                  }}
                >
                  Recent Work Gallery
                </a>
              </li>
              <li>
                <a
                  href="#/contact"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('contact');
                    }
                  }}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Fleet Machinery */}
          <div className="svem-footer-col">
            <h4 className="svem-footer-heading">Fleet Machinery</h4>
            <ul className="svem-footer-links">
              <li>
                <a
                  href="#/equipment"
                  className="svem-footer-link-highlight"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  ⭐ Complete Fleet (All Vehicles)
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  Hitachi 140 Excavator
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  Hyundai Robex 215L
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  Hitachi ZAXIS 220LC Quarry
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  50 Feet Long Reach Hitachi
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  Excavator with Rock Breaker
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  BharatBenz Heavy Tipper
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  Compressor &amp; Blasting Unit
                </a>
              </li>
              <li>
                <a
                  href="#/equipment"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('equipment');
                    }
                  }}
                >
                  JCB 3DX Backhoe Loader
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Operational Yard Details */}
          <div className="svem-footer-col">
            <h4 className="svem-footer-heading">Yard Details</h4>
            <div className="svem-footer-contact-items">
              <p className="svem-footer-contact-item">
                <MapPin size={16} className="svem-footer-contact-icon shrink-0" />
                <span>{BUSINESS_INFO.address}</span>
              </p>
              <p className="svem-footer-contact-item">
                <span className="svem-footer-coverage-badge">📍</span>
                <span className="svem-footer-coverage-text">Coverage: {BUSINESS_INFO.serviceArea}</span>
              </p>
              <p className="svem-footer-contact-item">
                <Phone size={16} className="svem-footer-contact-icon shrink-0" />
                <a href={getCallUrl()}>{BUSINESS_INFO.phone}</a>
              </p>
              <p className="svem-footer-contact-item">
                <Mail size={16} className="svem-footer-contact-icon shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`}>{BUSINESS_INFO.email}</a>
              </p>
              <p className="svem-footer-contact-item">
                <Clock size={16} className="svem-footer-contact-icon shrink-0" />
                <span>{BUSINESS_INFO.workingHours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar with TechNest Developer Details */}
        <div className="svem-footer-bottom">
          <div className="svem-footer-bottom-left">
            <p className="svem-footer-copy">
              &copy; {CURRENT_YEAR} Sri Venkateshwara Earth Movers. All Rights Reserved.
              <span className="svem-footer-disclaimer">
                [Placeholder website deployment - All rates &amp; contact info subject to final confirmation]
              </span>
            </p>
            <div className="svem-footer-legal-links">
              <button
                type="button"
                className="svem-footer-legal-btn"
                onClick={() => onOpenLegal?.('privacy')}
              >
                Privacy Policy
              </button>
              <span className="svem-footer-legal-dot">•</span>
              <button
                type="button"
                className="svem-footer-legal-btn"
                onClick={() => onOpenLegal?.('terms')}
              >
                Terms &amp; Conditions
              </button>
            </div>
          </div>

          {/* Developer Details: TechNest Studio / Developers: Aravind K, Sujith M / Contacts */}
          <div className="svem-footer-developer-credit" aria-label="Website Developer Credits">
            <div className="svem-developer-card">
              <div className="svem-dev-header">
                <Code2 size={14} className="svem-dev-icon" />
                <span className="svem-dev-by">Crafted by</span>
                <a
                  href="https://techneststudio.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="svem-dev-org svem-dev-org-link"
                  title="Visit TechNest Studio Website"
                >
                  TechNest Studio
                </a>
              </div>
              <div className="svem-dev-members">
                <span className="svem-dev-lead">Developers:</span>
                <span className="svem-dev-person">Aravind K</span>
                <span className="svem-dev-divider">•</span>
                <span className="svem-dev-person">Sujith M</span>
              </div>
              <div className="svem-dev-contacts">
                <a
                  href="https://techneststudio.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="svem-dev-contact-chip"
                  title="Visit techneststudio.in"
                >
                  <Globe size={11} className="svem-dev-contact-icon" />
                  <span>techneststudio.in</span>
                </a>
                <span className="svem-dev-contact-sep">•</span>
                <a
                  href="mailto:studiotechnest@gmail.com"
                  className="svem-dev-contact-chip"
                  title="Email studiotechnest@gmail.com"
                >
                  <Mail size={11} className="svem-dev-contact-icon" />
                  <span>studiotechnest@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Back to top Button */}
          <button
            type="button"
            className="svem-btn-back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};
