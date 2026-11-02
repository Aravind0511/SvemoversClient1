import React, { useEffect } from 'react';
import { X, Phone, Calendar, Check, Fuel, Wrench, Weight, Gauge } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import type { EquipmentItem } from '../types';
import { getCallUrl, getWhatsAppUrl } from '../config/businessInfo';

interface EquipmentModalProps {
  equipment: EquipmentItem | null;
  onClose: () => void;
  onBookNow: (equipment: EquipmentItem) => void;
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
  equipment,
  onClose,
  onBookNow
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (equipment) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [equipment, onClose]);

  if (!equipment) return null;

  const isAvailable = equipment.status === 'available';

  const waMessage = `Hello Sri Venkateshwara Earth Movers, I am interested in renting the ${equipment.name} (${equipment.model}). Please confirm availability, tariff rates, and operator deployment.`;
  const waUrl = getWhatsAppUrl(waMessage);

  return (
    <div className="svem-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="svem-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="svem-modal-close"
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        {/* Modal Scrollable Container */}
        <div className="svem-modal-body">
          {/* Top Hero Image & Availability Badge */}
          <div className="svem-modal-media">
            <img
              src={equipment.image}
              alt={equipment.name}
              className="svem-modal-img"
              loading="lazy"
              decoding="async"
              {...({ fetchpriority: 'low' } as any)}
            />
            <div className="svem-modal-media-overlay">
              <span
                className={`svem-status-indicator svem-status-indicator-lg ${
                  isAvailable ? 'svem-status-available' : 'svem-status-rented'
                }`}
              >
                <span className="svem-status-dot" />
                <span>{equipment.statusText}</span>
              </span>

              <span className="svem-modal-category-badge">{equipment.type}</span>
            </div>
          </div>

          {/* Modal Header */}
          <div className="svem-modal-header">
            <div className="svem-modal-title-group">
              <h2 className="svem-modal-title">{equipment.name}</h2>
              <p className="svem-modal-model">Model: {equipment.model}</p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="svem-modal-contact-badge"
              title="Chat with owner on WhatsApp for pricing"
            >
              <Phone size={14} className="text-amber-500" />
              <span>Contact Owner for Pricing</span>
            </a>
          </div>

          {/* Description */}
          <div className="svem-modal-desc-box">
            <h4 className="svem-modal-section-title">Overview &amp; Capabilities</h4>
            <p className="svem-modal-description">{equipment.fullDesc}</p>
          </div>

          {/* Specifications Grid */}
          <div className="svem-modal-specs-section">
            <h4 className="svem-modal-section-title">Technical Specifications</h4>
            <div className="svem-specs-grid">
              {equipment.specs.operatingWeight && (
                <div className="svem-spec-item">
                  <div className="svem-spec-icon"><Weight size={18} /></div>
                  <div className="svem-spec-info">
                    <span className="svem-spec-label">Operating Weight</span>
                    <span className="svem-spec-val">{equipment.specs.operatingWeight}</span>
                  </div>
                </div>
              )}
              {equipment.specs.enginePower && (
                <div className="svem-spec-item">
                  <div className="svem-spec-icon"><Gauge size={18} /></div>
                  <div className="svem-spec-info">
                    <span className="svem-spec-label">Engine Horsepower</span>
                    <span className="svem-spec-val">{equipment.specs.enginePower}</span>
                  </div>
                </div>
              )}
              {equipment.specs.bucketCapacity && (
                <div className="svem-spec-item">
                  <div className="svem-spec-icon"><Wrench size={18} /></div>
                  <div className="svem-spec-info">
                    <span className="svem-spec-label">Bucket / Blade</span>
                    <span className="svem-spec-val">{equipment.specs.bucketCapacity}</span>
                  </div>
                </div>
              )}
              {equipment.specs.diggingDepth && (
                <div className="svem-spec-item">
                  <div className="svem-spec-icon"><Gauge size={18} /></div>
                  <div className="svem-spec-info">
                    <span className="svem-spec-label">Max Digging Depth</span>
                    <span className="svem-spec-val">{equipment.specs.diggingDepth}</span>
                  </div>
                </div>
              )}
              {equipment.specs.payloadCapacity && (
                <div className="svem-spec-item">
                  <div className="svem-spec-icon"><Weight size={18} /></div>
                  <div className="svem-spec-info">
                    <span className="svem-spec-label">Payload / Centrifugal</span>
                    <span className="svem-spec-val">{equipment.specs.payloadCapacity}</span>
                  </div>
                </div>
              )}
              {equipment.specs.fuelCapacity && (
                <div className="svem-spec-item">
                  <div className="svem-spec-icon"><Fuel size={18} /></div>
                  <div className="svem-spec-info">
                    <span className="svem-spec-label">Fuel Tank Capacity</span>
                    <span className="svem-spec-val">{equipment.specs.fuelCapacity}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rental Options & Tariffs */}
          <div className="svem-modal-rates-section">
            <h4 className="svem-modal-section-title">Rental Options &amp; Packages</h4>
            <div className="svem-rates-grid">
              <div className="svem-rate-card">
                <span className="svem-rate-period">Hourly Rental</span>
                <span className="svem-rate-cost">{equipment.rates.hourly}</span>
                <span className="svem-rate-note">Min {equipment.minRentalHours} hours session</span>
              </div>
              <div className="svem-rate-card svem-rate-card-featured">
                <span className="svem-rate-badge">Popular</span>
                <span className="svem-rate-period">Daily Shift (8h)</span>
                <span className="svem-rate-cost">{equipment.rates.daily}</span>
                <span className="svem-rate-note">Includes certified operator</span>
              </div>
              <div className="svem-rate-card">
                <span className="svem-rate-period">Weekly Package</span>
                <span className="svem-rate-cost">{equipment.rates.weekly}</span>
                <span className="svem-rate-note">Discounted commercial rate</span>
              </div>
              <div className="svem-rate-card">
                <span className="svem-rate-period">Project Based</span>
                <span className="svem-rate-cost">{equipment.rates.project}</span>
                <span className="svem-rate-note">Custom earthwork contract</span>
              </div>
            </div>
            <p className="svem-disclaimer-note">
              * Tariffs are customized based on site distance, earth conditions, diesel supply arrangement, and shift duration. Contact the owner for a tailored quote.
            </p>
          </div>

          {/* Suitable Applications */}
          <div className="svem-modal-apps-section">
            <h4 className="svem-modal-section-title">Suitable Project Applications</h4>
            <div className="svem-apps-tags">
              {equipment.applications.map((app, idx) => (
                <div key={idx} className="svem-app-tag">
                  <Check size={14} className="svem-app-check" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="svem-modal-actions-bar">
            {/* Primary Book Button */}
            <button
              type="button"
              className="svem-btn-primary svem-modal-btn-book"
              onClick={() => {
                onClose();
                onBookNow(equipment);
              }}
            >
              <Calendar size={18} />
              <span>Book This Equipment Now</span>
            </button>

            {/* Call Owner Button */}
            <a
              href={getCallUrl()}
              className="svem-btn-outline-dark svem-modal-btn-call"
            >
              <Phone size={18} />
              <span>Call Owner</span>
            </a>

            {/* WhatsApp Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="svem-btn-whatsapp svem-modal-btn-wa"
            >
              <WhatsAppIcon size={18} />
              <span>WhatsApp Inquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
