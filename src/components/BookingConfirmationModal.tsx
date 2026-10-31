import React, { useEffect } from 'react';
import { CheckCircle2, MessageSquare, Phone, Mail, X } from 'lucide-react';
import type { Booking } from '../types';
import { getCallUrl, getWhatsAppUrl, getEquipmentBookingMailtoUrl } from '../config/businessInfo';
import { formatDateDisplay } from '../utils/dateUtils';

interface BookingConfirmationModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (booking) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [booking, onClose]);

  if (!booking) return null;

  const startFormatted = formatDateDisplay(booking.startDate);
  const endFormatted = formatDateDisplay(booking.endDate);

  const waText = `Hello Sri Venkateshwara Earth Movers, I have submitted a rental request (Ref: ${booking.id}) for ${booking.equipmentName} from ${startFormatted} to ${endFormatted} at ${booking.projectLocation}. Customer: ${booking.customerName} (${booking.phoneNumber}). Please confirm booking details.`;
  const waUrl = getWhatsAppUrl(waText);

  const emailUrl = getEquipmentBookingMailtoUrl(
    booking.equipmentName,
    booking.startDate,
    booking.endDate,
    {
      name: booking.customerName,
      phone: booking.phoneNumber,
      location: booking.projectLocation,
      rentalType: booking.rentalType,
      notes: `Booking Reference: ${booking.id}${booking.additionalRequirements ? ` | ${booking.additionalRequirements}` : ''}`
    }
  );

  return (
    <div className="svem-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="svem-confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="svem-modal-close"
          onClick={onClose}
          aria-label="Close confirmation"
        >
          <X size={20} />
        </button>

        <div className="svem-confirm-body">
          {/* Success Badge */}
          <div className="svem-confirm-icon-wrap">
            <CheckCircle2 size={54} className="svem-confirm-check-icon" />
          </div>

          <h2 className="svem-confirm-title">Booking Request Submitted</h2>
          <p className="svem-confirm-subtitle">
            We received your request. The owner will contact you shortly to confirm availability and rental details.
          </p>

          {/* Reference Pill */}
          <div className="svem-confirm-ref-badge">
            <span className="svem-ref-label">Booking Reference:</span>
            <span className="svem-ref-code">{booking.id}</span>
          </div>

          {/* Details Summary Card */}
          <div className="svem-confirm-summary-box">
            <div className="svem-confirm-summary-row">
              <span className="svem-summary-label">Equipment</span>
              <span className="svem-summary-val font-bold text-amber-600">{booking.equipmentName}</span>
            </div>

            <div className="svem-confirm-summary-row">
              <span className="svem-summary-label">Rental Duration</span>
              <span className="svem-summary-val">
                {startFormatted} &rarr; {endFormatted} ({booking.rentalType})
              </span>
            </div>

            <div className="svem-confirm-summary-row">
              <span className="svem-summary-label">Site Location</span>
              <span className="svem-summary-val">{booking.projectLocation}</span>
            </div>

            <div className="svem-confirm-summary-row">
              <span className="svem-summary-label">Customer Name</span>
              <span className="svem-summary-val">{booking.customerName}</span>
            </div>

            <div className="svem-confirm-summary-row">
              <span className="svem-summary-label">Contact Number</span>
              <span className="svem-summary-val">{booking.phoneNumber}</span>
            </div>

            {booking.additionalRequirements && (
              <div className="svem-confirm-summary-row svem-summary-notes-row">
                <span className="svem-summary-label">Notes</span>
                <span className="svem-summary-val italic">{booking.additionalRequirements}</span>
              </div>
            )}
          </div>

          {/* Action CTAs: Focused on WhatsApp & Email */}
          <div className="svem-confirm-actions">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="svem-btn-whatsapp svem-confirm-wa-btn"
            >
              <MessageSquare size={18} />
              <span>Confirm on WhatsApp</span>
            </a>

            <a
              href={emailUrl}
              className="svem-btn-email svem-confirm-email-btn"
            >
              <Mail size={18} />
              <span>Send Details via Email</span>
            </a>

            <a
              href={getCallUrl()}
              className="svem-btn-primary svem-confirm-call-btn"
            >
              <Phone size={18} />
              <span>Call Yard Owner</span>
            </a>
          </div>

          <div className="svem-confirm-footer">
            <button
              type="button"
              className="svem-btn-text-close"
              onClick={onClose}
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
