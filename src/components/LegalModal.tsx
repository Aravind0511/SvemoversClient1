import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Phone } from 'lucide-react';
import { BUSINESS_INFO, getCallUrl } from '../config/businessInfo';

export interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

const CURRENT_YEAR = 2026;

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      className="svem-modal-backdrop svem-legal-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legalModalTitle"
    >
      <div
        className="svem-modal-card svem-legal-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          className="svem-modal-close"
          onClick={onClose}
          aria-label="Close legal policy dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="svem-legal-modal-header">
          <div className="svem-legal-badge">
            {isPrivacy ? <ShieldCheck size={18} /> : <FileText size={18} />}
            <span>{isPrivacy ? 'Privacy & Data Protection' : 'Commercial Rental Terms'}</span>
          </div>
          <h2 id="legalModalTitle" className="svem-legal-modal-title">
            {isPrivacy
              ? 'Privacy Policy & Confidentiality Notice'
              : 'Terms & Conditions of Heavy Machinery Rental'}
          </h2>
          <p className="svem-legal-modal-meta">
            Sri Venkateshwara Earth Movers &bull; Official Yard Operating Protocol &bull; Effective {CURRENT_YEAR}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="svem-modal-body svem-legal-modal-body">
          {isPrivacy ? (
            <div className="svem-legal-content">
              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">1. Commitment to Client Confidentiality</h3>
                <p>
                  Sri Venkateshwara Earth Movers (SVEM) values your privacy. We are a direct heavy machinery owner and turnkey earth-moving fleet contractor operating across Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh. This Privacy Policy details how we handle the contact and site details you provide through our website, WhatsApp inquiries, or direct yard calls.
                </p>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">2. Information We Collect</h3>
                <p>We only collect information directly provided by contractors, developers, or project managers to process machinery bookings and site assessments:</p>
                <ul className="svem-legal-list">
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Contact Information:</strong> Full name, company or contractor trade name, telephone/WhatsApp mobile number, and email address.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Project &amp; Logistics Details:</strong> Worksite location (city/district), project type (earth excavation, rock breaking, trenching, canal desilting, demolition), target mobilization start date, and estimated duration.</span>
                  </li>
                </ul>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">3. Zero Third-Party Selling or Broker Distribution</h3>
                <p>
                  We operate on direct owner-to-client relationships with <strong>zero third-party brokers or external marketing intermediaries</strong>. Your phone number and site coordinates are never sold, rented, monetized, or shared with commercial marketing databases.
                </p>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">4. Purpose of Information Use</h3>
                <p>Your enquiry details are used exclusively for:</p>
                <ul className="svem-legal-list">
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Validating fleet machine availability on requested dates in our dispatch schedule.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Calculating accurate custom tariffs (diesel inclusion/exclusion, operator shift schedules, lowbed mobilization costs).</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>Coordinating certified heavy equipment operators and on-site machine delivery.</span>
                  </li>
                </ul>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">5. Data Retention &amp; Removal Requests</h3>
                <p>
                  Enquiry records are retained only as long as necessary for commercial logbook accounting and project coordination. You may request deletion or correction of your contact details at any time by calling our fleet manager directly.
                </p>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">6. Contact Yard Management</h3>
                <div className="svem-legal-contact-card">
                  <p className="font-semibold text-slate-800">Sri Venkateshwara Earth Movers</p>
                  <p className="text-slate-600 text-sm">Yard Address: {BUSINESS_INFO.address}</p>
                  <p className="text-slate-600 text-sm">Phone: {BUSINESS_INFO.phone}</p>
                  <p className="text-slate-600 text-sm">Email: {BUSINESS_INFO.email}</p>
                </div>
              </section>
            </div>
          ) : (
            <div className="svem-legal-content">
              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">1. Machinery Rental Bookings &amp; Mobilization</h3>
                <p>
                  All machinery rental requests (including single units and the Complete Fleet Package) are subject to final site feasibility assessment, confirmed date schedule, and lowbed trailer transport alignment. Mobilization begins upon verified booking agreement with our yard dispatcher.
                </p>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">2. Certified Operators &amp; Operational Safety</h3>
                <p>
                  Every vehicle in our fleet (Hitachi excavators, Hyundai Robex, 50ft Long Reach, Rock Breakers, BharatBenz tippers, and JCB backhoes) is dispatched with trained, licensed, safety-certified heavy machinery operators. For structural safety and equipment integrity, only SVEM certified drivers are permitted to operate our machinery.
                </p>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">3. Shift Norms &amp; Hour Calculations</h3>
                <ul className="svem-legal-list">
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Standard Shift:</strong> A standard daily rental shift consists of 8 machine operating hours.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Overtime &amp; Double Shifts:</strong> Work beyond standard hours requires prior mutual agreement and is logged transparently on verified daily operator timesheets.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Minimum Session:</strong> Hourly bookings carry a minimum mobilization session (typically 4 to 8 hours depending on machine category).</span>
                  </li>
                </ul>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">4. Worksite Access &amp; Ingress Clearances</h3>
                <p>
                  The client is responsible for ensuring stable, unhindered approach access for heavy transport trailers and crawlers to the worksite. Necessary permissions from local panchayats, municipal authorities, or police (especially for controlled quarry blasting or road trenching) must be secured prior to mobilization.
                </p>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">5. Diesel &amp; Fuel Supply Options</h3>
                <p>
                  Rental contracts may be executed under:
                </p>
                <ul className="svem-legal-list">
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Dry Rental:</strong> Client provides clean, high-grade diesel directly at the worksite with daily meter checks.</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Wet Rental:</strong> SVEM supplies all fuel and lubricants via dedicated on-site mobile refueling bowsers at pre-agreed comprehensive rates.</span>
                  </li>
                </ul>
              </section>

              <section className="svem-legal-section">
                <h3 className="svem-legal-heading">6. Multi-State Inter-State Mobilization</h3>
                <p>
                  Machinery mobilized across state borders (Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh) is subject to inter-state commercial transport regulations, national highway clearances, and agreed lowbed freight tariffs.
                </p>
              </section>
            </div>
          )}

          {/* Action Bar */}
          <div className="svem-legal-modal-actions">
            <button
              type="button"
              className="svem-btn-primary"
              onClick={onClose}
            >
              <span>I Understand &bull; Close Notice</span>
            </button>
            <a
              href={getCallUrl()}
              className="svem-btn-outline-dark svem-legal-call-btn"
            >
              <Phone size={16} />
              <span>Contact Yard Owner ({BUSINESS_INFO.phone})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
