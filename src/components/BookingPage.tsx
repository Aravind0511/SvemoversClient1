import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Phone,
  Truck,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Info,
  Clock,
  MapPin,
  User,
  Mail,
  ExternalLink,
  Sparkles,
  Loader2,
  CalendarDays,
  Wrench,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import type { EquipmentItem, Booking, RentalType, AppPage } from '../types';
import { formatDateDisplay, addDaysISO } from '../utils/dateUtils';
import {
  getEquipmentBookingWhatsAppUrl,
  getEquipmentBookingMailtoUrl,
} from '../config/businessInfo';
import { getAssetUrl } from '../utils/assets';
import { LOCATION_GROUPS, WORK_TYPE_OPTIONS } from '../data/bookingOptions';
import { sendBookingEmail } from '../services/emailService';
import './BookingPage.css';

interface BookingPageProps {
  equipmentList: EquipmentItem[];
  selectedEquipmentId: string;
  onSelectEquipmentId: (id: string) => void;
  bookings: Booking[];
  onAddBooking: (newBooking: Booking) => void;
  onBookingSuccess: (booking: Booking) => void;
  onUpdateBooking?: (booking: Booking) => void;
  onViewEquipmentDetails: (item: EquipmentItem) => void;
  onNavigate: (page: AppPage, sectionId?: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  equipmentList,
  selectedEquipmentId,
  onSelectEquipmentId,
  onAddBooking,
  onBookingSuccess,
  onUpdateBooking,
  onViewEquipmentDetails,
  onNavigate,
}) => {
  // Form state - customer & project fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [locationSelect, setLocationSelect] = useState('Salem');
  const [customLocation, setCustomLocation] = useState('');
  const [workTypeSelect, setWorkTypeSelect] = useState('');
  const [customWorkNote, setCustomWorkNote] = useState('');
  const [rentalType, setRentalType] = useState<RentalType>('Daily');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modern native date picker state
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-13');

  // Form error state
  const [formError, setFormError] = useState<string | null>(null);

  // Effective location derived from selection or custom input
  const effectiveLocation = useMemo(() => {
    if (locationSelect === 'Other') {
      return customLocation.trim();
    }
    return locationSelect || customLocation.trim();
  }, [locationSelect, customLocation]);

  // Effective work note derived from selection and custom input
  const effectiveProjectNote = useMemo(() => {
    if (workTypeSelect && workTypeSelect !== 'Other') {
      return customWorkNote.trim()
        ? `${workTypeSelect} (${customWorkNote.trim()})`
        : workTypeSelect;
    }
    return customWorkNote.trim();
  }, [workTypeSelect, customWorkNote]);

  // Active selected equipment object
  const activeEquipment = useMemo(() => {
    return (
      equipmentList.find((eq) => eq.id === selectedEquipmentId) ||
      equipmentList[0] || {
        id: 'jcb-3dx',
        name: 'JCB 3DX',
        type: 'Backhoe Loader',
        category: 'Backhoe',
        model: 'JCB 3DX Super EcoMAX',
        shortDesc: 'Heavy-duty all-rounder for excavation, trenching, and loading.',
        fullDesc: 'The JCB 3DX is the most trusted workhorse for Indian infrastructure.',
        status: 'available' as const,
        statusText: 'Available',
        image: getAssetUrl('/equipment/jcb-3dx.jpg'),
        specs: {
          fuelCapacity: '128 Litres',
          operatingWeight: '7,460 kg',
        },
        rates: {
          hourly: 'Available on Call',
          daily: 'Tariff on Request',
          weekly: 'Custom Weekly Tariff',
          project: 'Custom Contract Quote',
        },
        applications: ['Excavation', 'Construction', 'Land Development'],
        operatorIncluded: true,
        minRentalHours: 4,
      }
    );
  }, [equipmentList, selectedEquipmentId]);

  // Total duration in days calculated dynamically
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

  // WhatsApp and Email dynamic URLs pre-filled with active user inputs
  const currentWhatsAppUrl = useMemo(() => {
    return getEquipmentBookingWhatsAppUrl(
      activeEquipment.name,
      startDate || '2026-10-12',
      endDate || startDate || '2026-10-13',
      {
        name: customerName.trim() || undefined,
        phone: phoneNumber.trim() || undefined,
        location: effectiveLocation || undefined,
        rentalType,
        notes: effectiveProjectNote || undefined,
      }
    );
  }, [activeEquipment.name, startDate, endDate, customerName, phoneNumber, effectiveLocation, rentalType, effectiveProjectNote]);

  const currentEmailUrl = useMemo(() => {
    return getEquipmentBookingMailtoUrl(
      activeEquipment.name,
      startDate || '2026-10-12',
      endDate || startDate || '2026-10-13',
      {
        name: customerName.trim() || undefined,
        phone: phoneNumber.trim() || undefined,
        location: effectiveLocation || undefined,
        rentalType,
        notes: effectiveProjectNote || undefined,
      }
    );
  }, [activeEquipment.name, startDate, endDate, customerName, phoneNumber, effectiveLocation, rentalType, effectiveProjectNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    // Validate customer name
    if (!customerName.trim()) {
      setFormError('Please enter your full name or company name.');
      return;
    }

    // Validate phone number format (at least 10 digits for WhatsApp coordination)
    const rawDigits = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.trim() || rawDigits.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for WhatsApp booking coordination.');
      return;
    }

    // Validate optional email format
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address or leave the field blank.');
      return;
    }

    // Validate project location
    if (!effectiveLocation) {
      setFormError('Please select or enter the project worksite location.');
      return;
    }

    // Validate date selection
    if (!startDate) {
      setFormError('Please select a start date.');
      return;
    }

    const finalEndDate = endDate || startDate;
    if (finalEndDate < startDate) {
      setFormError('End date cannot be earlier than start date.');
      return;
    }

    // Process submission and generate confirmed booking enquiry
    setIsSubmitting(true);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SVEM-2026-${randomSuffix}`;
    const newBooking: Booking = {
      id: bookingId,
      equipmentId: activeEquipment.id,
      equipmentName: activeEquipment.name,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim() || undefined,
      rentalType,
      projectLocation: effectiveLocation,
      startDate,
      endDate: finalEndDate,
      additionalRequirements: effectiveProjectNote || undefined,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      emailStatus: 'pending',
    };

    onAddBooking(newBooking);
    onBookingSuccess(newBooking);

    // Automated dispatch via EmailJS directly to srivenkateshwaravechicles@gmail.com
    sendBookingEmail(newBooking)
      .then((res) => {
        if (res.success && res.status === 'sent') {
          onUpdateBooking?.({ ...newBooking, emailStatus: 'sent' });
        } else if (res.status === 'error') {
          onUpdateBooking?.({ ...newBooking, emailStatus: 'error', emailError: res.message });
        } else {
          onUpdateBooking?.({ ...newBooking, emailStatus: 'fallback' });
        }
      })
      .catch((err) => {
        onUpdateBooking?.({ ...newBooking, emailStatus: 'error', emailError: String(err) });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="svem-booking-page">
      {/* ------------------------------------------------------------------ */}
      {/* Hero Banner                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="svem-booking-simple-hero">
        <div className="svem-container">
          <nav className="svem-booking-breadcrumb" aria-label="Breadcrumb">
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
            <span className="svem-breadcrumb-current">Machinery Booking</span>
          </nav>

          <h1 className="svem-booking-hero-title">
            Book Heavy <span className="svem-booking-hero-accent">Machinery</span>
          </h1>
          <p className="svem-booking-hero-desc">
            Direct owner rentals with certified operators. Instant confirmation via WhatsApp and formal written quotations via Email.
          </p>

          <div className="svem-booking-coverage-tag">
            <MapPin size={15} />
            <span>Serving Tamil Nadu, Kerala, Andhra Pradesh &amp; Karnataka</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2-Column Streamlined Booking Section                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="svem-booking-main-section">
        <div className="svem-container">
          <div className="svem-booking-simple-layout">
            {/* ============================================================ */}
            {/* LEFT COLUMN: Machine Picker, Native Dates & Shift Selection  */}
            {/* ============================================================ */}
            <div className="svem-booking-left-col">
              {/* Step 1: Machinery Selection */}
              <div className="svem-simple-card">
                <div className="svem-card-header">
                  <div className="svem-step-badge">1</div>
                  <div>
                    <h2 className="svem-card-title">Select Machinery</h2>
                    <p className="svem-card-subtitle">Choose the equipment needed for your site</p>
                  </div>
                </div>

                <div className="svem-eq-dropdown-wrap">
                  <label htmlFor="equipmentSelect" className="svem-input-label">
                    Choose Equipment / Package
                  </label>
                  <select
                    id="equipmentSelect"
                    className="svem-select-input"
                    value={activeEquipment.id}
                    onChange={(e) => handleEquipmentChange(e.target.value)}
                  >
                    {equipmentList.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.id === 'all-vehicles-fleet' ? '⭐ ' : ''}
                        {eq.name} ({eq.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Highlight for All Vehicles Fleet */}
                {activeEquipment.id === 'all-vehicles-fleet' && (
                  <div className="svem-fleet-highlight-box">
                    <div className="svem-fleet-highlight-badge">
                      <Sparkles size={14} />
                      <span>Complete Fleet Package (All 8 Vehicles)</span>
                    </div>
                    <p className="svem-fleet-highlight-text">
                      Includes Hitachi 140, Robex 215L, Hitachi 220, 50ft Long Reach, Rock Breaker, BharatBenz 10W Tipper, Compressor &amp; Blasting, and JCB 3DX with certified operators.
                    </p>
                  </div>
                )}

                {/* Selected Machine Snapshot Card */}
                <div className="svem-machinery-preview-card">
                  <img
                    src={activeEquipment.image}
                    alt={activeEquipment.name}
                    className="svem-preview-thumbnail"
                  />
                  <div className="svem-preview-info">
                    <h3 className="svem-preview-title">{activeEquipment.name}</h3>
                    <p className="svem-preview-desc">{activeEquipment.shortDesc}</p>
                    <div className="svem-preview-tags">
                      <span className="svem-preview-tag">
                        <Truck size={12} /> {activeEquipment.category}
                      </span>
                      <span className="svem-preview-tag svem-preview-tag-operator">
                        <ShieldCheck size={12} /> Operator Included
                      </span>
                    </div>
                  </div>
                </div>

                <div className="svem-preview-actions">
                  <button
                    type="button"
                    className="svem-btn-view-details"
                    onClick={() => onViewEquipmentDetails(activeEquipment)}
                  >
                    <span>View Technical Specs &amp; Rates</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Step 2: Native Rental Dates & Shift Details */}
              <div className="svem-simple-card">
                <div className="svem-card-header">
                  <div className="svem-step-badge">2</div>
                  <div>
                    <h2 className="svem-card-title">Rental Dates &amp; Shift</h2>
                    <p className="svem-card-subtitle">
                      Set your estimated start date and project duration
                    </p>
                  </div>
                </div>

                {/* Duration Status Pill */}
                <div className="svem-duration-highlight-badge">
                  <CalendarDays size={16} />
                  <span>
                    Duration:{' '}
                    <strong>
                      {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
                    </strong>{' '}
                    ({formatDateDisplay(startDate)} &rarr;{' '}
                    {formatDateDisplay(endDate || startDate)})
                  </span>
                </div>

                {/* Native Mobile-Friendly Date Pickers */}
                <div className="svem-date-inputs-grid">
                  <div className="svem-date-field">
                    <label htmlFor="calStartDate" className="svem-input-label">
                      Start Date <span className="svem-req">*</span>
                    </label>
                    <input
                      id="calStartDate"
                      type="date"
                      className="svem-date-input"
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

                  <div className="svem-date-field">
                    <label htmlFor="calEndDate" className="svem-input-label">
                      End Date <span className="svem-req">*</span>
                    </label>
                    <input
                      id="calEndDate"
                      type="date"
                      className="svem-date-input"
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

                {/* Rental Duration Shift Selector */}
                <div className="svem-form-group" style={{ marginTop: '1.25rem' }}>
                  <label className="svem-input-label">
                    <Clock size={14} className="svem-label-icon" />
                    <span>Rental Duration Shift</span>
                  </label>
                  <div className="svem-rental-type-pills">
                    {(['Daily', 'Hourly', 'Weekly', 'Project Based'] as RentalType[]).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          className={`svem-rental-type-pill ${
                            rentalType === type ? 'svem-type-pill-active' : ''
                          }`}
                          onClick={() => handleRentalTypeChange(type)}
                        >
                          {type === 'Daily' ? 'Daily (8h)' : type}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Worksite Location Dropdown with 'Other' Option */}
                <div className="svem-form-group" style={{ marginTop: '1rem' }}>
                  <label htmlFor="custLocSelect" className="svem-input-label">
                    <MapPin size={14} className="svem-label-icon" />
                    <span>Project Location (City / Area)</span>
                    <span className="svem-req">*</span>
                  </label>
                  <select
                    id="custLocSelect"
                    className="svem-select-input"
                    value={locationSelect}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLocationSelect(val);
                      setFormError(null);
                    }}
                    required
                  >
                    <option value="">-- Choose Project City / Region --</option>
                    {LOCATION_GROUPS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value="Other">Other Location (Specify below)...</option>
                  </select>

                  {/* Custom location input when 'Other' is selected */}
                  {locationSelect === 'Other' && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <input
                        id="custLoc"
                        type="text"
                        className="svem-text-input"
                        placeholder="Enter specific city, town, or project site area..."
                        value={customLocation}
                        onChange={(e) => {
                          setCustomLocation(e.target.value);
                          setFormError(null);
                        }}
                        autoFocus
                        required
                      />
                    </div>
                  )}

                  <span className="svem-location-hint">
                    Inter-state mobilization: Tamil Nadu, Kerala, Andhra Pradesh &amp; Karnataka
                  </span>
                </div>

                {/* Project Work Details Dropdown with 'Other' Option */}
                <div className="svem-form-group" style={{ marginTop: '1rem' }}>
                  <label htmlFor="custWorkSelect" className="svem-input-label">
                    <Wrench size={14} className="svem-label-icon" />
                    <span>Project Work Details (Optional)</span>
                  </label>
                  <select
                    id="custWorkSelect"
                    className="svem-select-input"
                    value={workTypeSelect}
                    onChange={(e) => setWorkTypeSelect(e.target.value)}
                  >
                    <option value="">-- Select Work Scope / Operation --</option>
                    {WORK_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    <option value="Other">Other Work Type (Specify below)...</option>
                  </select>

                  {/* Custom / Additional details note field */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      id="custNote"
                      type="text"
                      className="svem-text-input"
                      placeholder={
                        workTypeSelect === 'Other'
                          ? 'Describe your custom work scope in detail...'
                          : workTypeSelect
                          ? 'Additional notes (e.g. trench depth, rocky area, 2 shifts)...'
                          : 'e.g. Earth excavation, canal trenching, rock demolition, land filling...'
                      }
                      value={customWorkNote}
                      onChange={(e) => setCustomWorkNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: Contact Details & Direct Booking Actions       */}
            {/* ============================================================ */}
            <div className="svem-booking-right-col">
              {/* Card 1: Fast Contact & Booking Request Form */}
              <div className="svem-simple-card svem-card-primary-form">
                <div className="svem-card-header">
                  <div className="svem-step-badge">3</div>
                  <div>
                    <h2 className="svem-card-title">Contact &amp; Booking</h2>
                    <p className="svem-card-subtitle">
                      Zero upfront booking fees. We coordinate directly with you.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="svem-streamlined-form">
                  {/* Field 1: Full Name */}
                  <div className="svem-form-group">
                    <label htmlFor="custName" className="svem-input-label">
                      <User size={14} className="svem-label-icon" />
                      <span>Full Name / Contractor Name</span>
                      <span className="svem-req">*</span>
                    </label>
                    <input
                      id="custName"
                      type="text"
                      className="svem-text-input"
                      placeholder="e.g. Ramesh Kumar / ABC Infra"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        setFormError(null);
                      }}
                      required
                    />
                  </div>

                  {/* Field 2: Phone Number */}
                  <div className="svem-form-group">
                    <label htmlFor="custPhone" className="svem-input-label">
                      <Phone size={14} className="svem-label-icon" />
                      <span>Phone Number (WhatsApp)</span>
                      <span className="svem-req">*</span>
                    </label>
                    <input
                      id="custPhone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="svem-text-input"
                      placeholder="e.g. 9944745410"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setFormError(null);
                      }}
                      required
                    />
                  </div>

                  {/* Field 3: Email Address (For Quotes) */}
                  <div className="svem-form-group">
                    <label htmlFor="custEmail" className="svem-input-label">
                      <Mail size={14} className="svem-label-icon" />
                      <span>Email Address (Recommended for GST Quotes)</span>
                    </label>
                    <input
                      id="custEmail"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className="svem-text-input"
                      placeholder="e.g. ramesh@infrastructure.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormError(null);
                      }}
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="svem-booking-quick-summary">
                    <div className="svem-summary-item">
                      <span className="svem-summary-item-label">Vehicle</span>
                      <span className="svem-summary-item-val">{activeEquipment.name}</span>
                    </div>
                    <div className="svem-summary-item">
                      <span className="svem-summary-item-label">Duration</span>
                      <span className="svem-summary-item-val">
                        {totalDays} {totalDays === 1 ? 'Day' : 'Days'} ({rentalType})
                      </span>
                    </div>
                    <div className="svem-summary-item">
                      <span className="svem-summary-item-label">Dates</span>
                      <span className="svem-summary-item-val">
                        {formatDateDisplay(startDate)} &rarr; {formatDateDisplay(endDate || startDate)}
                      </span>
                    </div>
                  </div>

                  {/* Error Banner */}
                  {formError && (
                    <div className="svem-form-error-alert" role="alert">
                      <AlertCircle size={16} />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    className="svem-btn-primary-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Generating Booking Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Booking Request</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                {/* Direct Action Divider */}
                <div className="svem-direct-actions-divider">
                  <span>OR BOOK INSTANTLY VIA WHATSAPP &amp; EMAIL</span>
                </div>

                {/* Instant Actions (WhatsApp + Email + Call) */}
                <div className="svem-instant-actions-grid">
                  <a
                    href={currentWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="svem-btn-action-wa"
                  >
                    <WhatsAppIcon size={18} />
                    <span>Book on WhatsApp</span>
                  </a>

                  <a
                    href={currentEmailUrl}
                    className="svem-btn-action-email"
                  >
                    <Mail size={18} />
                    <span>Book via Email</span>
                  </a>
                </div>
              </div>

              {/* Card 2: SVEM Trust Guarantees */}
              <div className="svem-simple-card svem-trust-card">
                <h3 className="svem-trust-card-title">
                  <ShieldCheck size={18} className="text-amber-600" />
                  <span>Why Rent from Sri Venkateshwara?</span>
                </h3>
                <ul className="svem-trust-list">
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>
                      <strong>Direct Owner Rates:</strong> Zero broker commissions or agent surcharges.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>
                      <strong>Seasoned Operators:</strong> Licensed heavy equipment drivers with 8+ years experience.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>
                      <strong>Inter-State Mobilization:</strong> Fast transport across Tamil Nadu, Kerala, Karnataka &amp; AP.
                    </span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>
                      <strong>24/7 Breakdown Assistance:</strong> Immediate replacement and mechanic support.
                    </span>
                  </li>
                </ul>

                <div className="svem-tariff-notice">
                  <Info size={15} />
                  <span>
                    Official tariff &amp; mobilization costs confirmed directly via WhatsApp or Email based on worksite distance.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
