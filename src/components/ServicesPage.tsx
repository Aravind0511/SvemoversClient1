import React from 'react';
import {
  Shovel,
  Truck,
  Construction,
  Hammer,
  Mountain,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import type { AppPage } from '../types';
import { SERVICES_LIST } from '../data/servicesData';
import {
  BUSINESS_INFO,
  getCallUrl,
  getWhatsAppUrl,
} from '../config/businessInfo';
import { getAssetUrl } from '../utils/assets';
import './ServicesPage.css';

interface ServicesPageProps {
  onNavigate: (page: AppPage, sectionId?: string) => void;
  onSelectEquipmentToBook?: (equipmentId: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onSelectEquipmentToBook,
}) => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'excavation':
        return <Shovel size={28} />;
      case 'breaker':
        return <Hammer size={28} />;
      case 'reach':
        return <Construction size={28} />;
      case 'demolition':
        return <Hammer size={28} />;
      case 'filling':
      case 'haulage':
        return <Truck size={28} />;
      case 'road':
        return <Construction size={28} />;
      case 'development':
      case 'blasting':
        return <Mountain size={28} />;
      default:
        return <Construction size={28} />;
    }
  };

  const getServiceImage = (id: string) => {
    switch (id) {
      case 'earth-excavation':
        return getAssetUrl('/equipment/hitachi-140.jpg');
      case 'rock-breaking-blasting':
        return getAssetUrl('/equipment/rock-breaker.jpg');
      case 'long-reach-excavation':
        return getAssetUrl('/services/50ft-long-reach-service.jpg?v=20261022');
      case 'building-demolition':
        return getAssetUrl('/gallery/rock-breaker-action.jpg');
      case 'earth-filling':
        return getAssetUrl('/about/earth-filling.jpg');
      case 'bulk-haulage':
        return getAssetUrl('/gallery/tipper-fleet-site.jpg');
      default:
        return getAssetUrl('/about/project-needs.jpg');
    }
  };

  const mapMachineryToId = (machineryName: string): string => {
    const lower = machineryName.toLowerCase();
    if (lower.includes('all') || lower.includes('fleet') || lower.includes('complete')) return 'all-vehicles-fleet';
    if (lower.includes('long reach') || lower.includes('50')) return 'hitachi-long-reach-50ft';
    if (lower.includes('breaker')) return 'rock-breaker';
    if (lower.includes('compressor') || lower.includes('blasting')) return 'compressor-blasting';
    if (lower.includes('140')) return 'hitachi-140';
    if (lower.includes('215')) return 'hitachi-215';
    if (lower.includes('220')) return 'hitachi-220';
    if (lower.includes('tipper')) return 'tipper-lorry';
    if (lower.includes('jcb')) return 'jcb-3dx';
    return 'hitachi-215';
  };

  const handleBookServiceMachine = (machineryName: string) => {
    const eqId = mapMachineryToId(machineryName);
    if (onSelectEquipmentToBook) {
      onSelectEquipmentToBook(eqId);
    }
    onNavigate('booking');
  };

  return (
    <div className="svem-services-page">
      {/* ------------------------------------------------------------------ */}
      {/* Hero Section */}
      {/* ------------------------------------------------------------------ */}
      <section
        className="svem-servpage-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.85) 60%, rgba(15, 23, 42, 0.45) 100%), url(${getAssetUrl('/about/earth-excavation.jpg')})`,
        }}
      >
        <div className="svem-container">
          <nav className="svem-servpage-breadcrumb" aria-label="Breadcrumb">
            <span
              role="link"
              tabIndex={0}
              className="svem-breadcrumb-link"
              onClick={() => onNavigate('home')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate('home');
              }}
            >
              Home
            </span>
            <span className="svem-breadcrumb-sep">&gt;</span>
            <span className="svem-breadcrumb-current">Contracting Services</span>
          </nav>

          <h1 className="svem-servpage-hero-title">
            Earth-Moving &amp; <span className="text-amber-500">Site Contracting</span>
          </h1>
          <p className="svem-servpage-hero-subtitle">
            Complete turnkey site preparation, excavation, filling, road-bed formation, and structural demolition with specialized fleet coordination.
          </p>

          <div className="svem-servpage-hero-ctas">
            <button
              type="button"
              className="svem-btn-primary"
              onClick={() => onNavigate('booking')}
            >
              <Calendar size={18} />
              <span>Book Machinery for Service</span>
            </button>

            <button
              type="button"
              className="svem-btn-outline-light"
              onClick={() => onNavigate('contact')}
            >
              <span>Request Site Assessment</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Detailed Services Deep Dive */}
      {/* ------------------------------------------------------------------ */}
      <section className="svem-servpage-list-section">
        <div className="svem-container">
          <div className="svem-section-title-wrap text-center svem-mb-4">
            <div className="svem-title-with-pill justify-center">
              <span className="svem-accent-pill" />
              <h2 className="svem-section-title">Our 5 Core Earthwork Services</h2>
            </div>
            <p className="svem-section-subtitle max-w-2xl mx-auto">
              Each service is executed by factory-trained heavy machinery operators under the supervision of seasoned site foremen.
            </p>
          </div>

          <div className="svem-servpage-cards-stack">
            {SERVICES_LIST.map((service, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={service.id}
                  className={`svem-servpage-detailed-card ${
                    isEven ? 'svem-card-reverse' : ''
                  }`}
                >
                  {/* Media Column */}
                  <div className="svem-servcard-media-col">
                    <img
                      src={getServiceImage(service.id)}
                      alt={service.title}
                      className="svem-servcard-img"
                      loading="lazy"
                    />
                    <div className="svem-servcard-icon-pill">
                      {getServiceIcon(service.iconName)}
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="svem-servcard-content-col">
                    <div className="svem-servcard-tag">Service 0{index + 1}</div>
                    <h3 className="svem-servcard-title">{service.title}</h3>
                    <p className="svem-servcard-lead">{service.shortDesc}</p>
                    <p className="svem-servcard-desc">{service.fullDesc}</p>

                    {/* Features list */}
                    <div className="svem-servcard-features">
                      <h4 className="svem-features-heading">Scope of Work &amp; Capabilities:</h4>
                      <ul className="svem-features-grid">
                        {service.features.map((feat, idx) => (
                          <li key={idx} className="svem-feature-item">
                            <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Assigned machinery */}
                    <div className="svem-servcard-machinery">
                      <span className="svem-machinery-label">Assigned Fleet Vehicles:</span>
                      <div className="svem-machinery-chips">
                        {service.suitableEquipment.map((mach, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="svem-machinery-book-chip"
                            onClick={() => handleBookServiceMachine(mach)}
                            title={`Book ${mach} for ${service.title}`}
                          >
                            <span>{mach}</span>
                            <ArrowRight size={12} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="svem-servcard-actions">
                      <button
                        type="button"
                        className="svem-btn-primary svem-btn-serv-enquire"
                        onClick={() => onNavigate('contact')}
                      >
                        <Phone size={16} />
                        <span>Enquire This Service</span>
                      </button>

                      <a
                        href={getWhatsAppUrl(`Hello, I would like to inquire about ${service.title} services for my project.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="svem-btn-outline-dark svem-btn-serv-wa"
                      >
                        <MessageSquare size={16} />
                        <span>WhatsApp Details</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4-Step Execution Workflow */}
      {/* ------------------------------------------------------------------ */}
      <section className="svem-servpage-workflow-section">
        <div className="svem-container">
          <div className="svem-section-title-wrap text-center svem-mb-4">
            <h2 className="svem-section-title">Our Project Execution Workflow</h2>
            <p className="svem-section-subtitle max-w-xl mx-auto">
              From site inspection to final laser-level compaction, here is how we ensure timely project completion.
            </p>
          </div>

          <div className="svem-workflow-grid">
            <div className="svem-workflow-card">
              <div className="svem-workflow-step-num">01</div>
              <h3 className="svem-workflow-step-title">Site Assessment</h3>
              <p className="svem-workflow-step-desc">
                We review topography, soil strata, rock hardness, and drainage conditions to recommend optimal machinery sizing.
              </p>
            </div>

            <div className="svem-workflow-card">
              <div className="svem-workflow-step-num">02</div>
              <h3 className="svem-workflow-step-title">Rapid Mobilization</h3>
              <p className="svem-workflow-step-desc">
                Lowbed trailers transport tracked excavators and dozers directly to your worksite alongside licensed operators.
              </p>
            </div>

            <div className="svem-workflow-card">
              <div className="svem-workflow-step-num">03</div>
              <h3 className="svem-workflow-step-title">Precision Earthwork</h3>
              <p className="svem-workflow-step-desc">
                Excavation, mass earth cutting, slope contouring, and vibratory rolling executed per architectural drawings.
              </p>
            </div>

            <div className="svem-workflow-card">
              <div className="svem-workflow-step-num">04</div>
              <h3 className="svem-workflow-step-title">Final Inspection</h3>
              <p className="svem-workflow-step-desc">
                Laser level checks and density compaction verification before handover to civil contractors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom CTA Banner */}
      {/* ------------------------------------------------------------------ */}
      <section className="svem-booking-cta-banner svem-mt-4">
        <div className="svem-container">
          <div className="svem-cta-banner-inner">
            <div className="svem-cta-banner-left">
              <div className="svem-cta-banner-icon-box">
                <Phone size={24} />
              </div>
              <div className="svem-cta-banner-text">
                <h3 className="svem-cta-banner-heading">Need an On-Site Earthwork Estimate?</h3>
                <p className="svem-cta-banner-sub">
                  Our site supervisor will coordinate your project across Tamil Nadu, Kerala, Andhra Pradesh, and Karnataka.
                </p>
              </div>
            </div>

            <div className="svem-cta-banner-actions">
              <a
                href={getWhatsAppUrl("Hello, I need an on-site earthwork estimate for my property.")}
                target="_blank"
                rel="noopener noreferrer"
                className="svem-btn-banner-wa"
              >
                <MessageSquare size={18} />
                <span>WhatsApp Site Manager</span>
              </a>

              <a href={getCallUrl()} className="svem-btn-banner-call">
                <Phone size={18} />
                <span>Call {BUSINESS_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
