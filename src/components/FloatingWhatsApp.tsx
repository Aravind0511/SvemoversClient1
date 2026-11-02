import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getWhatsAppUrl } from '../config/businessInfo';

export const FloatingWhatsApp: React.FC = () => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  const defaultMessage = `Hello Sri Venkateshwara Earth Movers, I need equipment rental support for my construction project. Could you please share machine availability and tariff rates?`;
  const waUrl = getWhatsAppUrl(defaultMessage);

  return (
    <aside className="svem-floating-wa-container" aria-label="Direct WhatsApp Support">
      {/* Interactive Tooltip Card */}
      {!tooltipDismissed && (
        <div className="svem-wa-tooltip" role="dialog" aria-label="WhatsApp quick chat option">
          <div className="svem-wa-tooltip-header">
            <span className="svem-wa-online-pill">
              <span className="svem-wa-online-dot" />
              Online Now
            </span>
            <button
              type="button"
              className="svem-wa-tooltip-close"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTooltipDismissed(true);
              }}
              aria-label="Dismiss chat tooltip"
              title="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
          <p className="svem-wa-tooltip-title">Chat with Owner</p>
          <p className="svem-wa-tooltip-text">
            Get instant machine tariff, yard photos &amp; mobilization confirmation on WhatsApp.
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="svem-floating-wa-btn"
        aria-label="Chat with owner on WhatsApp (+91 9944745410)"
        title="WhatsApp Sri Venkateshwara Earth Movers (+91 9944745410)"
      >
        {/* Animated dual radar pulse waves */}
        <span className="svem-wa-pulse svem-wa-pulse-1" aria-hidden="true" />
        <span className="svem-wa-pulse svem-wa-pulse-2" aria-hidden="true" />

        {/* Online status indicator dot on the button */}
        <span className="svem-wa-badge" aria-hidden="true" />

        {/* Ringing / wiggle animated icon */}
        <span className="svem-wa-icon-wrapper" aria-hidden="true">
          <WhatsAppIcon size={32} />
        </span>
      </a>
    </aside>
  );
};
