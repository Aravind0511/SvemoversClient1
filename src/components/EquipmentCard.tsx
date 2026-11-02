import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import type { EquipmentItem } from '../types';
import { getEquipmentTariffWhatsAppUrl } from '../config/businessInfo';

interface EquipmentCardProps {
  equipment: EquipmentItem;
  onViewDetails: (item: EquipmentItem) => void;
  onBookNow: (item: EquipmentItem) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onViewDetails,
  onBookNow
}) => {
  const isAvailable = equipment.status === 'available';
  const isAllVehicles = equipment.id === 'all-vehicles-fleet';

  return (
    <div className={`svem-eq-card ${isAllVehicles ? 'svem-eq-card-featured' : ''}`}>
      {/* Machinery Image Header */}
      <div className="svem-eq-img-wrapper">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="svem-eq-img"
          loading="lazy"
          decoding="async"
        />
        <div className="svem-eq-badge-category">
          {equipment.type}
        </div>
        {isAllVehicles && (
          <div className="svem-eq-badge-package">
            ⭐ All 8 Vehicles Combo
          </div>
        )}
      </div>

      {/* Equipment Card Body */}
      <div className="svem-eq-content">
        <div className="svem-eq-header-row">
          <h3 className="svem-eq-title">{equipment.name}</h3>
          <p className="svem-eq-type">{equipment.type}</p>
        </div>

        {/* Availability Status Indicator & Contact Owner Action */}
        <div className="svem-eq-status-row">
          <span
            className={`svem-status-indicator ${
              isAvailable ? 'svem-status-available' : 'svem-status-rented'
            }`}
          >
            <span className="svem-status-dot" />
            {isAvailable ? (
              <span className="svem-status-label">Available</span>
            ) : (
              <span className="svem-status-label">Currently Rented</span>
            )}
          </span>

          {/* Contact to Owner Feature instead of amount */}
          <a
            href={getEquipmentTariffWhatsAppUrl(equipment.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="svem-eq-contact-tag"
            title={`Contact owner for ${equipment.name} pricing and rental details`}
            onClick={(e) => e.stopPropagation()}
          >
            <Phone size={12} className="svem-eq-contact-icon shrink-0" />
            <span>Contact Owner</span>
          </a>
        </div>

        <p className="svem-eq-desc">
          {isAllVehicles
            ? 'Turnkey mobilization of all 8 core machines with certified operators for major site contracts.'
            : equipment.shortDesc}
        </p>

        {/* Included Vehicles List for Complete Fleet Card */}
        {isAllVehicles && (
          <div className="svem-eq-fleet-included">
            <span className="svem-eq-fleet-included-title">All 8 Machines Included:</span>
            <div className="svem-eq-fleet-tags">
              <span className="svem-eq-fleet-tag">Hitachi 140 / 215L / 220</span>
              <span className="svem-eq-fleet-tag">50ft Long Reach</span>
              <span className="svem-eq-fleet-tag">Rock Breaker</span>
              <span className="svem-eq-fleet-tag">Tipper Lorry</span>
              <span className="svem-eq-fleet-tag">Blasting Unit</span>
              <span className="svem-eq-fleet-tag">JCB 3DX</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="svem-eq-actions">
          <button
            type="button"
            className="svem-btn-primary svem-btn-eq-action"
            onClick={() => onViewDetails(equipment)}
          >
            <span>View Details</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            className={`svem-btn-outline-dark svem-btn-eq-book ${
              isAllVehicles ? 'svem-btn-book-all-fleet' : ''
            }`}
            onClick={() => onBookNow(equipment)}
            title={`Book ${equipment.name}`}
          >
            <span>{isAllVehicles ? 'Book All Vehicles' : 'Book Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
