import React from 'react';
import { Phone, Calendar } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getCallUrl, getWhatsAppUrl } from '../config/businessInfo';

interface FooterCTAProps {
  onOpenBooking: () => void;
}

export const FooterCTA: React.FC<FooterCTAProps> = ({ onOpenBooking }) => {
  return (
    <div className="svem-footer-cta-bar">
      <div className="svem-container">
        <div className="svem-footer-cta-inner">
          {/* Left: Phone Emblem and Callout Text */}
          <div className="svem-footer-cta-left">
            <div className="svem-footer-cta-icon-box">
              <Phone size={24} />
            </div>
            <div className="svem-footer-cta-text">
              <h3 className="svem-footer-cta-title">
                Need Equipment for Your Next Project?
              </h3>
              <p className="svem-footer-cta-desc">
                Contact us now for the best rental solutions and immediate site deployment.
              </p>
            </div>
          </div>

          {/* Right: Direct Action Buttons */}
          <div className="svem-footer-cta-actions">
            {/* WhatsApp Us Button */}
            <a
              href={getWhatsAppUrl("Hello Sri Venkateshwara Earth Movers, I need equipment for my construction project. Please share rental availability and quotes.")}
              target="_blank"
              rel="noopener noreferrer"
              className="svem-btn-whatsapp svem-footer-cta-btn"
            >
              <WhatsAppIcon size={18} />
              <span>WhatsApp Us</span>
            </a>

            {/* Call Now Button */}
            <a
              href={getCallUrl()}
              className="svem-btn-primary svem-footer-cta-btn"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </a>

            {/* Book Equipment Button */}
            <button
              type="button"
              className="svem-btn-outline-light svem-footer-cta-btn"
              onClick={onOpenBooking}
            >
              <Calendar size={18} />
              <span>Book Equipment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
