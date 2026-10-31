import React, { useState, useMemo } from 'react';
import { Calendar, ArrowRight, AlertCircle, XCircle, CheckCircle2, Phone, MessageCircle, FileText, MapPin, Loader2 } from 'lucide-react';
import type { EquipmentItem, Booking, RentalType } from '../types';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { WhyChooseUs } from './WhyChooseUs';
import { HowItWorks } from './HowItWorks';
import { findConflictingBooking, formatDateDisplay } from '../utils/dateUtils';
import { BUSINESS_INFO, getCallUrl, getEquipmentBookingWhatsAppUrl } from '../config/businessInfo';

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
  bookings,
  onAddBooking,
  onBookingSuccess
}) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [rentalType, setRentalType] = useState<RentalType>('Daily');
  const [projectLocation, setProjectLocation] = useState('');
  
  // Date State - Defaulting to available dates: Oct 12 to Oct 13, 2026 (2 days)
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-13');
  
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation & Error State
  const [formError, setFormError] = useState<string | null>(null);
  const [manualWarning, setManualWarning] = useState<string | null>(null);

  // Active selected equipment object
  const activeEquipment =
    equipmentList.find((eq) => eq.id === selectedEquipmentId) || equipmentList[0];

  // Derived conflict checking during render (React 19 pure derivation)
  const unavailableWarning = useMemo(() => {
    if (manualWarning) return manualWarning;
    if (!startDate) return null;

    const checkEnd = endDate || startDate;
    const conflict = findConflictingBooking(
      activeEquipment.id,
      startDate,
      checkEnd,
      bookings
    );

    if (conflict) {
      return 'This equipment is not available on the selected date. Please choose another date.';
    }
    return null;
  }, [manualWarning, startDate, endDate, activeEquipment.id, bookings]);

  const handleSelectDateRange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setFormError(null);
    setManualWarning(null);
  };

  const handleEquipmentChange = (newEquipmentId: string) => {
    onSelectEquipmentId(newEquipmentId);
    setManualWarning(null);
    setFormError(null);
  };

  const handleUnavailableDateSelected = (_dateStr: string, message: string) => {
    setManualWarning(message || 'This equipment is not available on the selected date. Please choose another date.');
    setFormError(null);
  };

  // Pre-filled dynamic WhatsApp URL matching specification
  const currentWhatsAppUrl = getEquipmentBookingWhatsAppUrl(
    activeEquipment.name,
    startDate,
    endDate || startDate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    // 1. Validate required fields
    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    const rawDigits = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.trim() || rawDigits.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for WhatsApp coordination.');
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
      setFormError('Please select a start date from the calendar.');
      return;
    }

    const finalEndDate = endDate || startDate;

    // 2. Validate End Date >= Start Date
    if (finalEndDate < startDate) {
      setFormError('End date cannot be earlier than start date.');
      return;
    }

    // 3. Backend-independent availability check
    const conflict = findConflictingBooking(
      activeEquipment.id,
      startDate,
      finalEndDate,
      bookings
    );

    if (conflict) {
      const conflictMsg = 'This equipment is not available on the selected date. Please choose another date.';
      setManualWarning(conflictMsg);
      setFormError(conflictMsg);
      return;
    }

    // 4. Process booking with verified recording state
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
        createdAt: new Date().toISOString()
      };

      onAddBooking(newBooking);
      onBookingSuccess(newBooking);
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <section id="booking" className="svem-section svem-booking-section">
      <div className="svem-container">
        {/* Two-column layout matching reference image */}
        <div className="svem-booking-layout">
          {/* Left Column: Main Booking Engine & Contact Owner */}
          <div className="svem-booking-left-col">
            <div className="svem-booking-form-card">
              {/* Card Header */}
              <div className="svem-booking-header">
                <div className="svem-booking-header-icon">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="svem-booking-title">Book Your Equipment</h3>
                  <p className="svem-booking-subtitle">
                    Fill in the details below to check availability and request a booking.
                  </p>
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="svem-booking-form">
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
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="svem-form-group">
                    <label htmlFor="phoneNumber" className="svem-form-label">
                      Phone Number <span className="svem-req">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      className="svem-form-input"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="svem-form-group">
                    <label htmlFor="email" className="svem-form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="svem-form-input"
                      placeholder="Enter your email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                          {eq.name} ({eq.type}) - {eq.status === 'available' ? 'Available' : 'Booked'}
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
                      Rental Type <span className="svem-req">*</span>
                    </label>
                    <select
                      id="rentalType"
                      className="svem-form-select"
                      value={rentalType}
                      onChange={(e) => setRentalType(e.target.value as RentalType)}
                      required
                    >
                      <option value="Hourly">Hourly Rental</option>
                      <option value="Daily">Daily Shift (8 hrs)</option>
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
                      placeholder="Enter project location"
                      value={projectLocation}
                      onChange={(e) => setProjectLocation(e.target.value)}
                      required
                    />
                    <span className="text-xs text-amber-700 font-medium block mt-1">
                      Service coverage: Tamil Nadu, Kerala, Andhra Pradesh &amp; Karnataka
                    </span>
                  </div>
                </div>

                {/* Date Inputs Display Row */}
                <div className="svem-form-grid-2">
                  <div className="svem-form-group">
                    <label htmlFor="startDateInput" className="svem-form-label">
                      Start Date <span className="svem-req">*</span>
                    </label>
                    <div className="svem-input-icon-wrap">
                      <input
                        id="startDateInput"
                        type="date"
                        className="svem-form-input svem-input-date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setManualWarning(null);
                          setFormError(null);
                          if (!endDate || e.target.value > endDate) {
                            setEndDate(e.target.value);
                          }
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="svem-form-group">
                    <label htmlFor="endDateInput" className="svem-form-label">
                      End Date <span className="svem-req">*</span>
                    </label>
                    <div className="svem-input-icon-wrap">
                      <input
                        id="endDateInput"
                        type="date"
                        className="svem-form-input svem-input-date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setManualWarning(null);
                          setFormError(null);
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Availability Calendar & Warning Column (Matching Reference Image) */}
                <div className="svem-booking-calendar-container">
                  {/* Left Column: Interactive Availability Calendar */}
                  <div className="svem-cal-col">
                    <AvailabilityCalendar
                      equipmentId={activeEquipment.id}
                      equipmentName={activeEquipment.name}
                      bookings={bookings}
                      startDate={startDate}
                      endDate={endDate}
                      onSelectDateRange={handleSelectDateRange}
                      onUnavailableDateSelected={handleUnavailableDateSelected}
                      onClearDates={() => {
                        setStartDate('');
                        setEndDate('');
                        setManualWarning(null);
                        setFormError(null);
                      }}
                    />
                  </div>

                  {/* Right Column: Status Alert Box + Additional Requirements */}
                  <div className="svem-status-notes-col">
                    {/* Red Unavailable Warning Box (Matching Reference Image) */}
                    {unavailableWarning ? (
                      <div className="svem-warning-box" role="alert">
                        <div className="svem-warning-icon">
                          <XCircle size={24} />
                        </div>
                        <div className="svem-warning-text">
                          <span className="svem-warning-title">Not Available</span>
                          <span className="svem-warning-message">{unavailableWarning}</span>
                        </div>
                      </div>
                    ) : startDate ? (
                      <div className="svem-available-box" role="status">
                        <div className="svem-available-icon">
                          <CheckCircle2 size={22} />
                        </div>
                        <div className="svem-available-text">
                          <span className="svem-available-title">Available for Selected Dates</span>
                          <span className="svem-available-message">
                            {activeEquipment.name} is ready for booking{' '}
                            {startDate === endDate
                              ? `on ${formatDateDisplay(startDate)}`
                              : `from ${formatDateDisplay(startDate)} to ${formatDateDisplay(endDate || startDate)}`}
                            .
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {/* Additional Requirements Text Area */}
                    <div className="svem-form-group svem-textarea-group">
                      <label htmlFor="additionalNotes" className="svem-form-label">
                        Additional Requirements
                      </label>
                      <textarea
                        id="additionalNotes"
                        className="svem-form-textarea"
                        rows={4}
                        placeholder="Enter any additional requirements (e.g. need 2 operators, rocky ground breaker needed, diesel on client account)..."
                        value={additionalRequirements}
                        onChange={(e) => setAdditionalRequirements(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Error Banner if any */}
                {formError && (
                  <div className="svem-form-error-banner" role="alert">
                    <AlertCircle size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Submit CTA Button (Disabled if date is unavailable or submitting) */}
                <div className="svem-booking-submit-wrap">
                  <button
                    type="submit"
                    className={`svem-btn-primary svem-btn-booking-submit ${
                      unavailableWarning || isSubmitting ? 'svem-btn-disabled' : ''
                    }`}
                    disabled={Boolean(unavailableWarning) || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Verifying Availability &amp; Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Check Availability &amp; Request Booking</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Dedicated Contact Owner Toolbar (Requirement: Call Now, WhatsApp, Request a Quote, Contact Owner) */}
            <div className="svem-owner-contact-bar">
              <div className="svem-owner-contact-header">
                <div>
                  <h4 className="svem-owner-contact-title">Direct Owner &amp; Fleet Contact</h4>
                  <p className="svem-owner-contact-subtitle">
                    Need instant confirmation or custom pricing for {activeEquipment.name}? Reach the yard directly.
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

                {/* 2. WhatsApp with prefilled equipment & requested dates */}
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

                {/* 3. Request a Quote */}
                <button
                  type="button"
                  className="svem-btn-owner-action svem-btn-quote-direct"
                  onClick={() => {
                    const el = document.getElementById('customerName');
                    el?.focus();
                  }}
                >
                  <FileText size={16} />
                  <span>Request a Quote</span>
                </button>

                {/* 4. Contact Owner */}
                <a
                  href="#contact"
                  className="svem-btn-owner-action svem-btn-contact-direct"
                >
                  <MapPin size={16} />
                  <span>Contact Owner</span>
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
