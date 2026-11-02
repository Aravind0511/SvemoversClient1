import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import type { AppPage } from '../types';
import {
  BUSINESS_INFO,
  getCallUrl,
  getWhatsAppUrl,
} from '../config/businessInfo';
import { sendContactEmail } from '../services/emailService';
import './ContactPage.css';

interface ContactPageProps {
  onNavigate: (page: AppPage, sectionId?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState('Earth Excavation');
  const [projectLocation, setProjectLocation] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full name or company name.');
      return;
    }

    const rawDigits = phone.replace(/\D/g, '');
    if (!phone.trim() || rawDigits.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for dispatch coordination.');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address or leave the field blank.');
      return;
    }

    setIsSubmitting(true);
    sendContactEmail({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      service: selectedService,
      location: projectLocation.trim(),
      message: message.trim(),
    }).finally(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    });
  };

  const faqs = [
    {
      q: 'How are rental rates determined?',
      a: 'Rental rates are customized based on duration (hourly, daily 8-hour shift, or weekly package), machine capacity, operator shifts, and site diesel arrangement. Contact our yard directly for an instant, transparent quote.',
    },
    {
      q: 'Do your machine rentals include trained operators?',
      a: 'Yes! All machinery from Sri Venkateshwara Earth Movers is operated by licensed, experienced drivers who know how to handle complex soil strata, trenching, and steep grade works safely.',
    },
    {
      q: 'How fast can machinery be mobilized to my worksite?',
      a: 'We mobilize our machinery rapidly across Tamil Nadu, Kerala, Andhra Pradesh, and Karnataka via dedicated lowbed trailers with prompt on-site setup.',
    },
    {
      q: 'Who supplies diesel / fuel for the machines?',
      a: 'We offer two flexible options: client-supplied diesel (net dry rental) or all-inclusive fuel supplied by our yard with dedicated mobile refueling tanks.',
    },
  ];

  return (
    <div className="svem-contact-page">
      {/* ------------------------------------------------------------------ */}
      {/* Hero Section */}
      {/* ------------------------------------------------------------------ */}
      <section className="svem-contactpage-hero">
        <div className="svem-container">
          <nav className="svem-contactpage-breadcrumb" aria-label="Breadcrumb">
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
            <span className="svem-breadcrumb-current">Contact Us</span>
          </nav>

          <h1 className="svem-contactpage-hero-title">
            Connect With Our <span className="text-amber-500">Fleet Yard</span>
          </h1>
          <p className="svem-contactpage-hero-subtitle">
            Direct coordination with our fleet supervisor, machinery dispatch coordinators, and 24/7 emergency site assistance team.
          </p>

          <div className="svem-contactpage-hero-ctas">
            <a href={getCallUrl()} className="svem-btn-primary">
              <Phone size={18} />
              <span>Call Owner Now ({BUSINESS_INFO.phone})</span>
            </a>

            <a
              href={getWhatsAppUrl("Hello Sri Venkateshwara Earth Movers, I need machinery for my construction site.")}
              target="_blank"
              rel="noopener noreferrer"
              className="svem-btn-outline-light"
            >
              <MessageSquare size={18} />
              <span>WhatsApp Instant Chat</span>
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Two Column Layout: Info + Form */}
      {/* ------------------------------------------------------------------ */}
      <div className="svem-container svem-contactpage-main-container">
        <div className="svem-contactpage-grid">
          {/* Left Column: Business Details & Map */}
          <div className="svem-contactpage-info-col">
            <div className="svem-contactpage-info-card">
              <div className="svem-section-title-bar">
                <span className="svem-section-accent-bar" />
                <h2 className="svem-card-section-title">Yard Location &amp; Contact Info</h2>
              </div>

              <div className="svem-contact-items-stack">
                {/* Address */}
                <div className="svem-contact-detail-row">
                  <div className="svem-detail-icon-wrap">
                    <MapPin size={22} />
                  </div>
                  <div className="svem-detail-text">
                    <span className="svem-detail-label">Main Yard Address</span>
                    <p className="svem-detail-val">{BUSINESS_INFO.address}</p>
                    <div className="svem-coverage-wrap">
                      <span className="svem-coverage-badge">
                        Coverage: {BUSINESS_INFO.serviceArea}
                      </span>
                      <div className="svem-coverage-states-row">
                        {BUSINESS_INFO.serviceStates.map((state) => (
                          <span key={state} className="svem-state-pill">
                            ✓ {state}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Phone */}
                <div className="svem-contact-detail-row">
                  <div className="svem-detail-icon-wrap">
                    <Phone size={22} />
                  </div>
                  <div className="svem-detail-text">
                    <span className="svem-detail-label">Direct Phone (Owner / Dispatch)</span>
                    <a href={getCallUrl()} className="svem-detail-link">
                      {BUSINESS_INFO.phone}
                    </a>
                    <span className="svem-detail-sub">Secondary: {BUSINESS_INFO.phoneSecondary}</span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="svem-contact-detail-row">
                  <div className="svem-detail-icon-wrap svem-icon-emerald">
                    <MessageSquare size={22} />
                  </div>
                  <div className="svem-detail-text">
                    <span className="svem-detail-label">WhatsApp Fleet Inquiries</span>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="svem-detail-link text-emerald-600"
                    >
                      {BUSINESS_INFO.whatsapp} (Online Support)
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="svem-contact-detail-row">
                  <div className="svem-detail-icon-wrap">
                    <Mail size={22} />
                  </div>
                  <div className="svem-detail-text">
                    <span className="svem-detail-label">Official Correspondence</span>
                    <a href={`mailto:${BUSINESS_INFO.email}`} className="svem-detail-link">
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="svem-contact-detail-row">
                  <div className="svem-detail-icon-wrap">
                    <Clock size={22} />
                  </div>
                  <div className="svem-detail-text">
                    <span className="svem-detail-label">Working Hours</span>
                    <p className="svem-detail-val">{BUSINESS_INFO.workingHours}</p>
                    <div className="svem-emergency-pill">
                      <ShieldAlert size={14} />
                      <span>{BUSINESS_INFO.emergencySupport}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="svem-contactpage-map-wrap">
                <iframe
                  title="Sri Venkateshwara Earth Movers Location Map"
                  src={BUSINESS_INFO.mapEmbedUrl}
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: '10px' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="svem-contactpage-form-col">
            <div className="svem-contactpage-form-card">
              <div className="svem-section-title-bar">
                <span className="svem-section-accent-bar" />
                <h2 className="svem-card-section-title">Send a Site Enquiry</h2>
              </div>
              <p className="svem-form-subtext">
                Need bulk earth-moving contracting or special long-term rental rates? Fill in your requirements below.
              </p>

              {submitted ? (
                <div className="svem-contactpage-success-card" role="status">
                  <CheckCircle2 size={54} className="text-emerald-500 mb-3" />
                  <h3 className="svem-success-title">Enquiry Received Successfully</h3>
                  <p className="svem-success-desc">
                    Thank you, <strong>{name}</strong>. Our fleet dispatcher will contact you via <strong>{phone}</strong> shortly to discuss machine mobilization.
                  </p>

                  <div className="svem-success-actions">
                    <a
                      href={getWhatsAppUrl(`Hello, I submitted a contact enquiry for ${name} (${phone}) regarding ${selectedService}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="svem-btn-whatsapp"
                    >
                      <MessageSquare size={16} />
                      <span>Follow-up on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      className="svem-btn-outline-dark"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setPhone('');
                        setEmail('');
                        setProjectLocation('');
                        setMessage('');
                      }}
                    >
                      Submit Another Query
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="svem-contactpage-form">
                  <div className="svem-form-group">
                    <label htmlFor="contactFullName" className="svem-form-label">
                      Full Name / Company Name <span className="svem-req">*</span>
                    </label>
                    <input
                      id="contactFullName"
                      type="text"
                      className="svem-form-input"
                      placeholder="e.g. Ramesh Kumar / R.K. Builders"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="svem-form-grid-2">
                    <div className="svem-form-group">
                      <label htmlFor="contactPhone" className="svem-form-label">
                        Phone Number <span className="svem-req">*</span>
                      </label>
                      <input
                        id="contactPhone"
                        type="tel"
                        className="svem-form-input"
                        placeholder="e.g. +91 9944745410"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="svem-form-group">
                      <label htmlFor="contactEmail" className="svem-form-label">
                        Email Address (Optional)
                      </label>
                      <input
                        id="contactEmail"
                        type="email"
                        className="svem-form-input"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="svem-form-grid-2">
                    <div className="svem-form-group">
                      <label htmlFor="contactService" className="svem-form-label">
                        Service / Equipment Needed
                      </label>
                      <select
                        id="contactService"
                        className="svem-form-select"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                      >
                        <option value="Earth Excavation">Earth Excavation</option>
                        <option value="Earth Filling">Earth Filling &amp; Leveling</option>
                        <option value="Road Work">Road Work &amp; Compaction</option>
                        <option value="Demolition">Building Demolition</option>
                        <option value="Land Development">Layout Land Development</option>
                        <option value="JCB 3DX Rental">JCB 3DX Backhoe Rental</option>
                        <option value="Excavator Rental">20T Crawler Excavator Rental</option>
                        <option value="Tipper Lorry Rental">16 CBM Heavy Tipper Rental</option>
                        <option value="Multiple Fleet Package">Multiple Fleet Package</option>
                      </select>
                    </div>

                    <div className="svem-form-group">
                      <label htmlFor="contactLocation" className="svem-form-label">
                        Worksite Location
                      </label>
                      <input
                        id="contactLocation"
                        type="text"
                        className="svem-form-input"
                        placeholder="City, Taluk or Landmark"
                        value={projectLocation}
                        onChange={(e) => setProjectLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="svem-form-group">
                    <label htmlFor="contactMessage" className="svem-form-label">
                      Project Details / Special Requirements
                    </label>
                    <textarea
                      id="contactMessage"
                      className="svem-form-textarea"
                      rows={4}
                      placeholder="Tell us about your project depth, soil condition, estimated shift duration, rock breaker requirements, etc..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {formError && (
                    <div className="svem-form-error-banner" role="alert">
                      <AlertCircle size={18} />
                      <span>{formError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`svem-btn-primary svem-btn-full ${isSubmitting ? 'svem-btn-disabled' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Frequently Asked Questions */}
        {/* ------------------------------------------------------------------ */}
        <section className="svem-contactpage-faq-section">
          <div className="svem-section-title-wrap text-center svem-mb-4">
            <h2 className="svem-section-title">Frequently Asked Questions</h2>
            <p className="svem-section-subtitle max-w-xl mx-auto">
              Common questions answered about heavy machinery rentals and contracting procedures.
            </p>
          </div>

          <div className="svem-faq-grid">
            {faqs.map((faq, i) => (
              <div key={i} className="svem-faq-card">
                <div className="svem-faq-q-row">
                  <HelpCircle size={20} className="text-amber-500 shrink-0" />
                  <h3 className="svem-faq-question">{faq.q}</h3>
                </div>
                <p className="svem-faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

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
                <h3 className="svem-cta-banner-heading">Need Direct Booking Right Now?</h3>
                <p className="svem-cta-banner-sub">
                  Use our live date availability calendar to submit a real-time booking request.
                </p>
              </div>
            </div>

            <div className="svem-cta-banner-actions">
              <button
                type="button"
                className="svem-btn-primary"
                onClick={() => onNavigate('booking')}
              >
                <Calendar size={18} />
                <span>Go to Booking Page</span>
              </button>

              <a href={getCallUrl()} className="svem-btn-banner-call">
                <Phone size={18} />
                <span>Call Owner</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
