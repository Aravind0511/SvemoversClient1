import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  AlertCircle,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Loader2,
  Clock,
  Send,
} from 'lucide-react';
import type { EquipmentItem, Booking, RentalType } from '../types';
import { WhyChooseUs } from './WhyChooseUs';
import { HowItWorks } from './HowItWorks';
import { formatDateDisplay, addDaysISO } from '../utils/dateUtils';
import {
  BUSINESS_INFO,
  getCallUrl,
  getEquipmentBookingWhatsAppUrl,
  getEquipmentBookingMailtoUrl,
} from '../config/businessInfo';

interface BookingSectionProps {
  equipmentList: EquipmentItem[];
  selectedEquipmentId: string;
  onSelectEquipmentId: (id: string) => void;
  bookings: Booking[];
  onAddBooking: (newBooking: Booking) => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  equipmentList,
  selectedEquipmentId,
  onSelectEquipmentId,
  onAddBooking,
  onBookingSuccess,
}) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [rentalType, setRentalType] = useState<RentalType>('Daily');
  const [projectLocation, setProjectLocation] = useState('');

  // Native Date State - default to 2-day period
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-13');

  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation & Error State
  const [formError, setFormError] = useState<string | null>(null);

  // Active selected equipment object
  const activeEquipment =
    equipmentList.find((eq) => eq.id === selectedEquipmentId) || equipmentList[0];

  // Dynamic total days calculation
  const totalDays = useMemo(() => {
    if (!startDate) return 1;
    const finalEnd = endDate || startDate;
    const startD = new Date(startDate);
    const endD = new Date(finalEnd);
    const diffTime = Math.abs(endD.getTime() - startD.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  const handleRentalTypeChange = (type: RentalType) => {
    setRentalType(type);
    if (!startDate) return;

    if (type === 'Daily' || type === 'Hourly') {
      setEndDate(startDate);
    } else if (type === 'Weekly') {
      setEndDate(addDaysISO(startDate, 6));
    }
  };

  const handleEquipmentChange = (newEquipmentId: string) => {
    onSelectEquipmentId(newEquipmentId);
    setFormError(null);
  };

  // WhatsApp & Email booking URLs with real-time customer data
  const currentWhatsAppUrl = useMemo(() => {
    return getEquipmentBookingWhatsAppUrl(
      activeEquipment.name,
      startDate,
      endDate || startDate,
      {
        name: customerName.trim() || undefined,
        phone: phoneNumber.trim() || undefined,
        location: projectLocation.trim() || undefined,
        rentalType,
        notes: additionalRequirements.trim() || undefined,
      }
    );
  }, [activeEquipment.name, startDate, endDate, customerName, phoneNumber, projectLocation, rentalType, additionalRequirements]);

  const currentEmailUrl = useMemo(() => {
    return getEquipmentBookingMailtoUrl(
      activeEquipment.name,
      startDate,
      endDate || startDate,
      {
        name: customerName.trim() || undefined,
        phone: phoneNumber.trim() || undefined,
        location: projectLocation.trim() || undefined,
        rentalType,
        notes: additionalRequirements.trim() || undefined,
      }
    );
  }, [activeEquipment.name, startDate, endDate, customerName, phoneNumber, projectLocation, rentalType, additionalRequirements]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    // 1. Validate required fields
    if (!customerName.trim()) {
      setFormError('Please enter your full name or company name.');
      return;
    }

    const rawDigits = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.trim() || rawDigits.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for WhatsApp booking coordination.');
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address or leave the field blank.');
      return;
    }

    if (!projectLocation.trim()) {
      setFormError('Please enter the project or worksite location.');
      return;
    }
    if (!startDate) {
      setFormError('Please select a start date.');
      return;
    }

    const finalEndDate = endDate || startDate;
    if (finalEndDate < startDate) {
      setFormError('End date cannot be earlier than start date.');
      return;
    }

    // 2. Process booking with verified recording state
    setIsSubmitting(true);
    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newBooking: Booking = {
        id: `SVEM-2026-${randomSuffix}`,
        equipmentId: activeEquipment.id,
        equipmentName: activeEquipment.name,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        rentalType,
        projectLocation: projectLocation.trim(),
        startDate,
        endDate: finalEndDate,
        additionalRequirements: additionalRequirements.trim() || undefined,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      onAddBooking(newBooking);
      onBookingSuccess(newBooking);
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <section id="booking" className="svem-section svem-booking-section">
      <div className="svem-container">
        {/* Section Header */}
        <div className="svem-section-header text-center" style={{ marginBottom: '2.5rem' }}>
          <span className="svem-section-badge">Fast Direct Booking</span>
          <h2 className="svem-section-title">
            Book Machinery via <span className="text-amber-500">WhatsApp &amp; Email</span>
          </h2>
          <p className="svem-section-subtitle">
            Zero booking fees. Get instant availability and direct owner pricing within minutes.
          </p>
        </div>

        {/* Priority Channel Callouts: WhatsApp & Email Focus */}
        <div className="svem-home-channels-grid">
          <a
            href={currentWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="svem-home-channel-card svem-home-channel-wa"
          >
            <div className="svem-home-channel-icon-wrap">
              <MessageCircle size={24} />
            </div>
            <div>
              <span className="svem-home-channel-badge">⚡ Instant WhatsApp Booking</span>
              <h3 className="svem-home-channel-title">Chat with Owner on WhatsApp</h3>
              <p className="svem-home-channel-desc">
                Fastest response for <strong>{activeEquipment.name}</strong> • +91 9944745410
              </p>
            </div>
          </a>

          <a
            href={currentEmailUrl}
            className="svem-home-channel-card svem-home-channel-email"
          >
            <div className="svem-home-channel-icon-wrap">
              <Mail size={24} />
            </div>
            <div>
              <span className="svem-home-channel-badge svem-badge-email">📄 Official Written Quote</span>
              <h3 className="svem-home-channel-title">Request Quotation via Email</h3>
              <p className="svem-home-channel-desc">
                Formal RFPs &amp; GST tariff sent to <strong>{BUSINESS_INFO.email}</strong>
              </p>
            </div>
          </a>
        </div>

        {/* Two-column layout */}
        <div className="svem-booking-layout">
          {/* Left Column: Main Booking Engine & Contact Owner */}
          <div className="svem-booking-left-col">
            <div className="svem-booking-form-card">
              {/* Card Header */}
              <div className="svem-booking-header">
                <div className="svem-booking-header-icon">
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h3 className="svem-booking-title">Equipment Booking &amp; Quote Request</h3>
                  <p className="svem-booking-subtitle">
                    Fill in your project requirements below for immediate mobilization.
                  </p>
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} noValidate className="svem-booking-form">
                {/* Form Row 1: Name, Phone, Email */}
                <div className="svem-form-grid-3">
                  <div className="svem-form-group">
                    <label htmlFor="customerName" className="svem-form-label">
                      Your Name <span className="svem-req">*</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      className="svem-form-input"
                      placeholder="e.g. Ramesh Kumar"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setFormError(null);
                      }}
                      required
                    />
                  </div>

                  <div className="svem-form-group">
                    <label htmlFor="phoneNumber" className="svem-form-label">
                      Phone Number (WhatsApp) <span className="svem-req">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="svem-form-input"
                      placeholder="e.g. 9944745410"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setFormError(null);
                      }}
                      required
                    />
                  </div>

                  <div className="svem-form-group">
                    <label htmlFor="email" className="svem-form-label">
                      Email Address (For Written Quote)
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className="svem-form-input"
                      placeholder="e.g. your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormError(null);
                      }}
                    />
                  </div>
                </div>

                {/* Form Row 2: Equipment, Rental Type, Location */}
                <div className="svem-form-grid-3">
                  <div className="svem-form-group">
                    <label htmlFor="equipmentSelect" className="svem-form-label">
                      Select Equipment <span className="svem-req">*</span>
                    </label>
                    <select
                      id="equipmentSelect"
                      className="svem-form-select"
                      value={selectedEquipmentId}
                      onChange={(e) => handleEquipmentChange(e.target.value)}
                      required
                    >
                      {equipmentList.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name} ({eq.type})
                        </option>
                      ))}
                    </select>
                    {activeEquipment.id === 'all-vehicles-fleet' && (
                      <div className="svem-booking-fleet-callout">
                        <span className="svem-booking-fleet-callout-pill">⭐ All 8 Vehicles Combo</span>
                        <p className="svem-booking-fleet-callout-desc">
                          Includes Hitachi 140, 215, 220, 50ft Long Reach, Rock Breaker, BharatBenz Tipper, Compressor &amp; Blasting, and JCB 3DX with certified operators.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="svem-form-group">
                    <label htmlFor="rentalType" className="svem-form-label">
                      Rental Shift <span className="svem-req">*</span>
                    </label>
                    <select
                      id="rentalType"
                      className="svem-form-select"
                      value={rentalType}
                      onChange={(e) => handleRentalTypeChange(e.target.value as RentalType)}
                      required
                    >
                      <option value="Daily">Daily Shift (8 hrs)</option>
                      <option value="Hourly">Hourly Rental</option>
                      <option value="Weekly">Weekly Package</option>
                      <option value="Project Based">Project Based Contract</option>
                    </select>
                  </div>

                  <div className="svem-form-group">
                    <label htmlFor="projectLocation" className="svem-form-label">
                      Project Location <span className="svem-req">*</span>
                    </label>
                    <input
                      id="projectLocation"
                      type="text"
                      className="svem-form-input"
                      placeholder="e.g. Salem, Namakkal, Dharmapuri..."
                      value={projectLocation}
                      onChange={(e) => {
                        setProjectLocation(e.target.value);
                        setFormError(null);
                      }}
                      required
                    />
                    <span className="text-xs text-amber-700 font-medium block mt-1">
                      Coverage: Tamil Nadu, Kerala, Andhra Pradesh &amp; Karnataka
                    </span>
                  </div>
                </div>

                {/* Form Row 3: Native Mobile-Friendly Date Pickers & Duration Badge */}
                <div className="svem-dates-row-container">
                  <div className="svem-form-grid-2">
                    <div className="svem-form-group">
                      <label htmlFor="startDateInput" className="svem-form-label">
                        Start Date <span className="svem-req">*</span>
                      </label>
                      <input
                        id="startDateInput"
                        type="date"
                        className="svem-form-input svem-input-date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setFormError(null);
                          if (!endDate || e.target.value > endDate) {
                            setEndDate(e.target.value);
                          }
                        }}
                        required
                      />
                    </div>

                    <div className="svem-form-group">
                      <label htmlFor="endDateInput" className="svem-form-label">
                        End Date <span className="svem-req">*</span>
                      </label>
                      <input
                        id="endDateInput"
                        type="date"
                        className="svem-form-input svem-input-date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setFormError(null);
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Calculated Duration Highlight Banner */}
                  <div className="svem-duration-banner">
                    <Clock size={16} />
                    <span>
                      Duration: <strong>{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</strong> ({formatDateDisplay(startDate)} &rarr; {formatDateDisplay(endDate || startDate)}) • Shift: <strong>{rentalType}</strong>
                    </span>
                  </div>
                </div>

                {/* Additional Requirements Text Area */}
                <div className="svem-form-group svem-textarea-group" style={{ marginTop: '1rem' }}>
                  <label htmlFor="additionalNotes" className="svem-form-label">
                    Additional Requirements (Optional)
                  </label>
                  <textarea
                    id="additionalNotes"
                    className="svem-form-textarea"
                    rows={3}
                    placeholder="Enter any project details (e.g. need 2 operators, rocky ground breaker needed, canal trenching depth)..."
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                  />
                </div>

                {/* Form Error Banner if any */}
                {formError && (
                  <div className="svem-form-error-banner" role="alert">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Submit CTA Buttons: Web Submit, WhatsApp, Email */}
                <div className="svem-booking-actions-row">
                  <button
                    type="submit"
                    className="svem-btn-primary svem-btn-booking-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </button>

                  <a
                    href={currentWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="svem-btn-wa-booking"
                  >
                    <MessageCircle size={18} />
                    <span>Book on WhatsApp</span>
                  </a>

                  <a
                    href={currentEmailUrl}
                    className="svem-btn-email-booking"
                  >
                    <Mail size={18} />
                    <span>Request Quote by Email</span>
                  </a>
                </div>
              </form>
            </div>

            {/* Dedicated Contact Owner Toolbar */}
            <div className="svem-owner-contact-bar">
              <div className="svem-owner-contact-header">
                <div>
                  <h4 className="svem-owner-contact-title">Direct Owner &amp; Fleet Contact</h4>
                  <p className="svem-owner-contact-subtitle">
                    Need instant machinery mobilization for {activeEquipment.name}? Contact the yard directly.
                  </p>
                </div>
              </div>

              <div className="svem-owner-contact-actions">
                {/* 1. Call Now */}
                <a
                  href={getCallUrl()}
                  className="svem-btn-owner-action svem-btn-call-direct"
                  title={`Call owner at ${BUSINESS_INFO.phone}`}
                >
                  <Phone size={16} />
                  <span>Call Now</span>
                </a>

                {/* 2. WhatsApp */}
                <a
                  href={currentWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="svem-btn-owner-action svem-btn-wa-direct"
                  title="Chat on WhatsApp with prefilled booking details"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>

                {/* 3. Email Quote */}
                <a
                  href={currentEmailUrl}
                  className="svem-btn-owner-action svem-btn-quote-direct"
                  title="Request quote via official email"
                >
                  <Mail size={16} />
                  <span>Email Quote</span>
                </a>

                {/* 4. Yard Location */}
                <a
                  href="#contact"
                  className="svem-btn-owner-action svem-btn-contact-direct"
                >
                  <MapPin size={16} />
                  <span>Yard Location</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Why Choose Us & How It Works */}
          <div className="svem-booking-right-col">
            <WhyChooseUs />
            <HowItWorks />
          </div>
        </div>
      </div>
    </section>
  );
};
