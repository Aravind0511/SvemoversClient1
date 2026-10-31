import React from 'react';
import {
  ArrowRight,
  Calendar,
  Settings,
  Users,
  Headphones,
  ShieldCheck,
  Wrench,
  FileText,
  Target,
  Check,
  Search,
  Truck,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Logo } from './Logo';
import { BUSINESS_INFO, getCallUrl, getWhatsAppUrl } from '../config/businessInfo';
import { getAssetUrl } from '../utils/assets';
import type { AppPage } from '../types';
import './AboutPage.css';

interface AboutPageProps {
  onNavigate: (page: AppPage, sectionId?: string) => void;
  onOpenBooking: () => void;
  onOpenLegal?: (type: 'privacy' | 'terms') => void;
}

const CURRENT_YEAR = 2026;

// Authentic WhatsApp SVG Icon matching template branding
const WhatsAppIcon: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 18,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.301-.776.978-.952 1.179-.175.2-.35.226-.651.075-.301-.15-1.272-.469-2.423-1.496-.895-.799-1.5-1.786-1.675-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.35.451-.526.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.676-1.63-.926-2.232-.244-.587-.492-.507-.676-.516l-.576-.01c-.2 0-.526.075-.802.376-.276.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.2 2.118 3.235 5.132 4.536.717.31 1.277.495 1.713.633.72.229 1.375.197 1.893.12.578-.086 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.83.49 3.62 1.43 5.21L2 22l4.9-1.41c1.54.89 3.29 1.37 5.14 1.37 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2zm0 18.23c-1.61 0-3.18-.43-4.56-1.25l-.33-.2-3.39.98.99-3.31-.22-.35c-.9-1.43-1.38-3.09-1.38-4.8 0-4.54 3.7-8.23 8.24-8.23 4.54 0 8.24 3.7 8.24 8.24 0 4.53-3.7 8.22-8.24 8.22z" />
  </svg>
);

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenBooking, onOpenLegal }) => {

  return (
    <div className="about-page">
      {/* ------------------------------------------------------------------ */}
      {/* 1. Hero Section with breadcrumbs, title, subtitle & CTAs */}
      {/* ------------------------------------------------------------------ */}
      <section className="about-hero" aria-label="About Us Hero">
        <div className="svem-container">
          <div className="about-hero-inner">
            {/* Breadcrumb: Home / About Us */}
            <nav className="about-breadcrumb" aria-label="Breadcrumb">
              <span
                role="link"
                tabIndex={0}
                className="about-breadcrumb-link"
                onClick={() => onNavigate('home')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onNavigate('home');
                }}
              >
                Home
              </span>
              <span className="about-breadcrumb-sep">/</span>
              <span className="about-breadcrumb-current">About Us</span>
            </nav>

            {/* Main Hero Headline */}
            <h1 className="about-hero-title">
              About
              <br />
              Sri Venkateshwara
              <span className="about-hero-title-accent">Earth Movers</span>
            </h1>

            {/* Subtitle */}
            <p className="about-hero-subtitle">
              Reliable machinery. Practical solutions. Support for every project.
            </p>

            {/* Action CTA Buttons */}
            <div className="about-hero-actions">
              <button
                type="button"
                className="about-btn-primary"
                onClick={() => onNavigate('equipment')}
              >
                <span>Explore Our Equipment</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="about-btn-secondary"
                onClick={() => onNavigate('contact')}
              >
                <Calendar size={18} />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2. WHO WE ARE - Supporting Your Work on the Ground */}
      {/* ------------------------------------------------------------------ */}
      <section className="about-who-section" aria-labelledby="who-we-are-heading">
        <div className="svem-container">
          <div className="about-who-grid">
            {/* Left Column: Excavator Digging Photo */}
            <div className="about-who-image-wrap">
              <img
                src={getAssetUrl('/about/who-we-are.jpg')}
                alt="Sri Venkateshwara Heavy Excavator on Construction Site"
                className="about-who-img"
                loading="eager"
              />
            </div>

            {/* Right Column: Narrative & 3 Feature Highlights */}
            <div className="about-who-content">
              <div className="about-eyebrow-row">
                <span className="about-accent-bar" aria-hidden="true" />
                <span className="about-eyebrow-text">WHO WE ARE</span>
              </div>

              <h2 id="who-we-are-heading" className="about-section-heading">
                Supporting Your Work on the Ground
              </h2>

              <p className="about-who-desc">
                Sri Venkateshwara Earth Movers provides heavy earth-moving equipment rental and
                support for construction, excavation, road work, demolition, and land development
                projects across Tamil Nadu, Kerala, Andhra Pradesh, and Karnataka.
              </p>
              <p className="about-who-desc" style={{ marginTop: '0.65rem' }}>
                We aim to make it easy for our customers to get the right machinery for
                their project with clear communication, flexible rental options and reliable
                service throughout the South Indian region.
              </p>

              {/* 3 Core Points */}
              <div className="about-who-features">
                {/* 1. Reliable Equipment */}
                <div className="about-who-feature-item">
                  <div className="about-feature-icon-badge" aria-hidden="true">
                    <Settings size={22} />
                  </div>
                  <div className="about-feature-info">
                    <h3 className="about-feature-title">Reliable Equipment</h3>
                    <p className="about-feature-desc">
                      Well-maintained machinery suited for different project needs.
                    </p>
                  </div>
                </div>

                {/* 2. Clear Communication */}
                <div className="about-who-feature-item">
                  <div className="about-feature-icon-badge" aria-hidden="true">
                    <Users size={22} />
                  </div>
                  <div className="about-feature-info">
                    <h3 className="about-feature-title">Clear Communication</h3>
                    <p className="about-feature-desc">
                      Quick response and transparent coordination.
                    </p>
                  </div>
                </div>

                {/* 3. Project-Focused Support */}
                <div className="about-who-feature-item">
                  <div className="about-feature-icon-badge" aria-hidden="true">
                    <Headphones size={22} />
                  </div>
                  <div className="about-feature-info">
                    <h3 className="about-feature-title">Project-Focused Support</h3>
                    <p className="about-feature-desc">
                      Helping you find the right equipment for your specific requirement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3. 4-Point Dark Badge Bar */}
      {/* ------------------------------------------------------------------ */}
      <section className="about-dark-bar-wrap" aria-label="Trust Highlights">
        <div className="svem-container">
          <div className="about-dark-bar">
            {/* Item 1: Safety-Minded Work */}
            <div className="about-dark-item">
              <ShieldCheck size={26} className="about-dark-icon" />
              <div className="about-dark-text-block">
                <span className="about-dark-title">Safety-Minded Work</span>
                <span className="about-dark-sub">Focus on safe and efficient operations.</span>
              </div>
            </div>

            {/* Item 2: Well-Maintained Machinery */}
            <div className="about-dark-item">
              <Wrench size={26} className="about-dark-icon" />
              <div className="about-dark-text-block">
                <span className="about-dark-title">Well-Maintained Machinery</span>
                <span className="about-dark-sub">Regularly serviced for better performance.</span>
              </div>
            </div>

            {/* Item 3: Flexible Rental Enquiries */}
            <div className="about-dark-item">
              <FileText size={26} className="about-dark-icon" />
              <div className="about-dark-text-block">
                <span className="about-dark-title">Flexible Rental Enquiries</span>
                <span className="about-dark-sub">Hourly, daily or project-based rental options.</span>
              </div>
            </div>

            {/* Item 4: Responsive Support */}
            <div className="about-dark-item">
              <Headphones size={26} className="about-dark-icon" />
              <div className="about-dark-text-block">
                <span className="about-dark-title">Responsive Support</span>
                <span className="about-dark-sub">Quick communication and assistance.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Side-by-side highlight cards ("Our Mission" and "Our Approach") */}
      {/* ------------------------------------------------------------------ */}
      <section className="about-highlights-wrap" aria-label="Our Mission and Approach">
        <div className="svem-container">
          <div className="about-highlights-grid">
            {/* Card 1: Our Mission */}
            <div className="about-highlight-card">
              <div className="about-highlight-icon-badge" aria-hidden="true">
                <Target size={28} />
              </div>
              <div className="about-highlight-content">
                <h3 className="about-highlight-title">Our Mission</h3>
                <p className="about-highlight-text">
                  To provide reliable earth-moving equipment and support that helps our
                  customers complete their construction, excavation and land development
                  projects efficiently.
                </p>
              </div>
            </div>

            {/* Card 2: Our Approach */}
            <div className="about-highlight-card">
              <div className="about-highlight-icon-badge" aria-hidden="true">
                <Users size={28} />
              </div>
              <div className="about-highlight-content">
                <h3 className="about-highlight-title">Our Approach</h3>
                <p className="about-highlight-text">
                  We focus on understanding your project requirements, providing suitable
                  machinery and ensuring a smooth rental experience with clear coordination
                  and dedicated support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5. What We Support (4 Photo Cards) */}
      {/* ------------------------------------------------------------------ */}
      <section className="about-services-section" aria-labelledby="what-we-support-heading">
        <div className="svem-container">
          <div className="about-services-header">
            <div className="about-eyebrow-row">
              <span className="about-accent-bar" aria-hidden="true" />
              <h2 id="what-we-support-heading" className="about-section-heading">
                What We Support
              </h2>
            </div>
            <p className="about-section-subheading">
              Wide range of services with the right equipment for your project.
            </p>
          </div>

          <div className="about-services-grid">
            {/* Card 1: Earth Excavation */}
            <div
              className="about-service-card"
              onClick={() => onNavigate('home', 'services')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate('home', 'services');
              }}
            >
              <div className="about-service-img-wrap">
                <img
                  src={getAssetUrl('/about/earth-excavation.jpg')}
                  alt="Earth Excavation Work"
                  className="about-service-img"
                  loading="lazy"
                />
              </div>
              <div className="about-service-body">
                <h3 className="about-service-card-title">Earth Excavation</h3>
                <p className="about-service-card-desc">
                  Excavation for building construction, pipeline, footing, pits and more.
                </p>
              </div>
            </div>

            {/* Card 2: Earth Filling */}
            <div
              className="about-service-card"
              onClick={() => onNavigate('home', 'services')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate('home', 'services');
              }}
            >
              <div className="about-service-img-wrap">
                <img
                  src={getAssetUrl('/about/earth-filling.jpg')}
                  alt="Earth Filling Work"
                  className="about-service-img"
                  loading="lazy"
                />
              </div>
              <div className="about-service-body">
                <h3 className="about-service-card-title">Earth Filling</h3>
                <p className="about-service-card-desc">
                  Mass earth filling and site development work.
                </p>
              </div>
            </div>

            {/* Card 3: Road Work */}
            <div
              className="about-service-card"
              onClick={() => onNavigate('home', 'services')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate('home', 'services');
              }}
            >
              <div className="about-service-img-wrap">
                <img
                  src={getAssetUrl('/about/road-work.jpg')}
                  alt="Road Construction Work"
                  className="about-service-img"
                  loading="lazy"
                />
              </div>
              <div className="about-service-body">
                <h3 className="about-service-card-title">Road Work</h3>
                <p className="about-service-card-desc">
                  All types of road construction and related work.
                </p>
              </div>
            </div>

            {/* Card 4: Land Development */}
            <div
              className="about-service-card"
              onClick={() => onNavigate('home', 'services')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate('home', 'services');
              }}
            >
              <div className="about-service-img-wrap">
                <img
                  src={getAssetUrl('/about/land-development.jpg')}
                  alt="Land Development Work"
                  className="about-service-img"
                  loading="lazy"
                />
              </div>
              <div className="about-service-body">
                <h3 className="about-service-card-title">Land Development</h3>
                <p className="about-service-card-desc">
                  Site leveling, land preparation and development support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6. Built Around Your Project Needs Section */}
      {/* ------------------------------------------------------------------ */}
      <section className="about-needs-section" aria-labelledby="project-needs-heading">
        <div className="svem-container">
          <div className="about-needs-grid">
            {/* Left Column: Mountain Excavator Panoramic Banner */}
            <div className="about-needs-img-wrap">
              <img
                src={getAssetUrl('/about/project-needs.jpg')}
                alt="Excavator at project landscape"
                className="about-needs-img"
                loading="lazy"
              />
            </div>

            {/* Right Column: Title, Description, Checklist & CTA */}
            <div className="about-needs-content">
              <div className="about-eyebrow-row">
                <span className="about-accent-bar" aria-hidden="true" />
                <h2 id="project-needs-heading" className="about-section-heading">
                  Built Around Your Project Needs
                </h2>
              </div>

              <p className="about-needs-desc">
                We provide earth-moving equipment on rental to support a variety of
                construction and development projects. Our focus is to make the equipment
                rental process simple, reliable and convenient for our customers.
              </p>

              {/* 3 Checklist Items */}
              <div className="about-checklist">
                <div className="about-checklist-item">
                  <span className="about-check-badge">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span>Equipment suited to the job</span>
                </div>

                <div className="about-checklist-item">
                  <span className="about-check-badge">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span>Easy booking enquiry</span>
                </div>

                <div className="about-checklist-item">
                  <span className="about-check-badge">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span>Direct contact with our team</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="about-needs-cta-wrap">
                <button
                  type="button"
                  className="about-btn-primary"
                  onClick={onOpenBooking}
                >
                  <span>Book Equipment</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7. A Simple Way to Get Started (4-Step Process) */}
      {/* ------------------------------------------------------------------ */}
      <section className="about-process-section" aria-labelledby="get-started-heading">
        <div className="svem-container">
          <div className="about-process-header">
            <div className="about-eyebrow-row">
              <span className="about-accent-bar" aria-hidden="true" />
              <h2 id="get-started-heading" className="about-section-heading">
                A Simple Way to Get Started
              </h2>
            </div>
            <p className="about-section-subheading">
              Follow these steps to book the equipment your project.
            </p>
          </div>

          <div className="about-process-row">
            {/* Step 1 */}
            <div className="about-step-card">
              <div className="about-step-circle-badge" aria-hidden="true">
                <Search size={22} />
              </div>
              <div className="about-step-info">
                <span className="about-step-name">1. Tell Us What You Need</span>
                <span className="about-step-hint">Share your project requirements.</span>
              </div>
            </div>

            <ChevronRight size={20} className="about-step-chevron" aria-hidden="true" />

            {/* Step 2 */}
            <div className="about-step-card">
              <div className="about-step-circle-badge" aria-hidden="true">
                <Calendar size={22} />
              </div>
              <div className="about-step-info">
                <span className="about-step-name">2. Choose Equipment &amp; Dates</span>
                <span className="about-step-hint">Select the equipment and preferred dates.</span>
              </div>
            </div>

            <ChevronRight size={20} className="about-step-chevron" aria-hidden="true" />

            {/* Step 3 */}
            <div className="about-step-card">
              <div className="about-step-circle-badge" aria-hidden="true">
                <div className="about-step-check-dot">
                  <Check size={13} color="#ffffff" strokeWidth={3.5} />
                </div>
              </div>
              <div className="about-step-info">
                <span className="about-step-name">3. Confirm Availability</span>
                <span className="about-step-hint">We will check and confirm the availability.</span>
              </div>
            </div>

            <ChevronRight size={20} className="about-step-chevron" aria-hidden="true" />

            {/* Step 4 */}
            <div className="about-step-card">
              <div className="about-step-circle-badge" aria-hidden="true">
                <Truck size={22} />
              </div>
              <div className="about-step-info">
                <span className="about-step-name">4. Coordinate Your Rental</span>
                <span className="about-step-hint">Get the equipment on time for your project.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 8. Dark CTA Banner ("Have a Project Coming Up?") */}
      {/* ------------------------------------------------------------------ */}
      <section className="about-cta-banner-wrap" aria-label="Project Consultation CTA">
        <div className="svem-container">
          <div className="about-cta-banner">
            {/* Left side: Icon + Text */}
            <div className="about-cta-left">
              <div className="about-cta-icon-box" aria-hidden="true">
                <Phone size={24} color="#ffffff" />
              </div>
              <div className="about-cta-text-block">
                <h3 className="about-cta-title">Have a Project Coming Up?</h3>
                <p className="about-cta-desc">
                  Let&apos;s discuss the equipment and rental period you need.
                </p>
              </div>
            </div>

            {/* Right side: WhatsApp & Call Buttons */}
            <div className="about-cta-buttons">
              <a
                href={getWhatsAppUrl(
                  "Hello Sri Venkateshwara Earth Movers, I have an upcoming construction project and would like to discuss equipment availability and rental rates."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="about-btn-wa"
              >
                <WhatsAppIcon size={20} color="#ffffff" />
                <span>WhatsApp Us</span>
              </a>

              <a href={getCallUrl()} className="about-btn-call">
                <Phone size={18} />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 9. Complete Footer matching the design template */}
      {/* ------------------------------------------------------------------ */}
      <footer className="about-footer">
        <div className="svem-container">
          <div className="about-footer-top">
            <div className="about-footer-bar">
              {/* Left Column: Brand Logo */}
              <div className="about-footer-brand">
                <Logo
                  size="md"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                  }}
                />
              </div>

              {/* Center Column: Quick Navigation Links in Single Horizontal Row */}
              <nav className="about-footer-nav" aria-label="Footer Quick Navigation">
                <ul className="about-footer-nav-list">
                  <li>
                    <span
                      role="link"
                      tabIndex={0}
                      className="about-footer-nav-link"
                      onClick={() => onNavigate('home')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') onNavigate('home');
                      }}
                    >
                      Home
                    </span>
                  </li>
                  <li>
                    <span
                      role="link"
                      tabIndex={0}
                      className="about-footer-nav-link about-footer-nav-link-active"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      About Us
                    </span>
                  </li>
                  <li>
                    <span
                      role="link"
                      tabIndex={0}
                      className="about-footer-nav-link"
                      onClick={() => onNavigate('equipment')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          onNavigate('equipment');
                      }}
                    >
                      Equipment
                    </span>
                  </li>
                  <li>
                    <span
                      role="link"
                      tabIndex={0}
                      className="about-footer-nav-link"
                      onClick={() => onNavigate('booking')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          onNavigate('booking');
                      }}
                    >
                      Book Equipment
                    </span>
                  </li>
                  <li>
                    <span
                      role="link"
                      tabIndex={0}
                      className="about-footer-nav-link"
                      onClick={() => onNavigate('services')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          onNavigate('services');
                      }}
                    >
                      Services
                    </span>
                  </li>
                  <li>
                    <span
                      role="link"
                      tabIndex={0}
                      className="about-footer-nav-link"
                      onClick={() => onNavigate('gallery')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          onNavigate('gallery');
                      }}
                    >
                      Gallery
                    </span>
                  </li>
                  <li>
                    <span
                      role="link"
                      tabIndex={0}
                      className="about-footer-nav-link"
                      onClick={() => onNavigate('contact')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          onNavigate('contact');
                      }}
                    >
                      Contact Us
                    </span>
                  </li>
                </ul>
              </nav>

              {/* Right Column: Contact Details with 2 sub-columns matching template */}
              <div className="about-footer-contact-group">
                <div className="about-footer-contact-col">
                  <div className="about-footer-contact-item">
                    <Phone size={14} className="about-footer-contact-icon" />
                    <a href={getCallUrl()}>{BUSINESS_INFO.phone}</a>
                  </div>

                  <div className="about-footer-contact-item">
                    <WhatsAppIcon size={14} className="about-footer-contact-icon" color="var(--svem-dark)" />
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {BUSINESS_INFO.whatsapp}
                    </a>
                  </div>

                  <div className="about-footer-contact-item">
                    <Mail size={14} className="about-footer-contact-icon" />
                    <a href={`mailto:${BUSINESS_INFO.email}`}>{BUSINESS_INFO.email}</a>
                  </div>
                </div>

                <div className="about-footer-contact-divider" aria-hidden="true" />

                <div className="about-footer-address-col">
                  <MapPin size={16} className="about-footer-contact-icon about-footer-pin-icon" />
                  <div className="about-footer-address-text">
                    <span className="about-footer-address-line">{BUSINESS_INFO.address.split(',')[0]}</span>
                    <span className="about-footer-address-city">{BUSINESS_INFO.city}, {BUSINESS_INFO.state}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Dark Bottom Bar */}
        <div className="about-footer-bottom">
          <div className="svem-container">
            <div className="about-footer-bottom-inner">
              <p className="about-footer-copy">
                &copy; {CURRENT_YEAR} Sri Venkateshwara Earth Movers. All rights reserved.
              </p>

              <div className="about-footer-legal-links">
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenLegal) {
                      onOpenLegal('privacy');
                    } else {
                      window.location.hash = '#/privacy';
                    }
                  }}
                >
                  Privacy Policy
                </a>
                <span>|</span>
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenLegal) {
                      onOpenLegal('terms');
                    } else {
                      window.location.hash = '#/terms';
                    }
                  }}
                >
                  Terms &amp; Conditions
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
