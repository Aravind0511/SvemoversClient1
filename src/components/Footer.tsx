import React from 'react';
import { ArrowUp, MapPin, Phone, Mail, Clock } from 'lucide-react';
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
    <footer className="svem-footer">
      <div className="svem-container">
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
            <div className="mt-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
                Service Coverage States
              </span>
              <div className="flex flex-wrap gap-1">
                {BUSINESS_INFO.serviceStates.map((st) => (
                  <span
                    key={st}
                    className="text-[11px] font-medium bg-slate-800 text-amber-400 border border-slate-700 rounded px-2 py-0.5"
                  >
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
                  className="font-bold text-amber-400"
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
                  Compressor & Blasting Unit
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

          {/* Col 4: Operational Hub */}
          <div className="svem-footer-col">
            <h4 className="svem-footer-heading">Yard Details</h4>
            <div className="svem-footer-contact-items">
              <p className="svem-footer-contact-item">
                <MapPin size={16} className="text-amber-500 shrink-0" />
                <span>{BUSINESS_INFO.address}</span>
              </p>
              <p className="svem-footer-contact-item">
                <span className="text-amber-500 font-bold shrink-0 text-xs">📍</span>
                <span className="text-xs text-amber-300">Coverage: {BUSINESS_INFO.serviceArea}</span>
              </p>
              <p className="svem-footer-contact-item">
                <Phone size={16} className="text-amber-500 shrink-0" />
                <a href={getCallUrl()}>{BUSINESS_INFO.phone}</a>
              </p>
              <p className="svem-footer-contact-item">
                <Mail size={16} className="text-amber-500 shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`}>{BUSINESS_INFO.email}</a>
              </p>
              <p className="svem-footer-contact-item">
                <Clock size={16} className="text-amber-500 shrink-0" />
                <span>{BUSINESS_INFO.workingHours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
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
