import { formatDateDisplay } from '../utils/dateUtils.ts';

/**
 * SRI VENKATESHWARA EARTH MOVERS
 * Business Configuration & Placeholders
 * 
 * NOTE: All contact details, pricing, reviews, and address information below
 * are placeholders and can be replaced with verified business data.
 */

export const BUSINESS_INFO = {
  name: "SRI VENKATESHWARA EARTH MOVERS",
  shortName: "SV Earth Movers",
  tagline: "Excavator, Breaker & Tipper Rental Services",
  subtitle: "Hitachi Excavators, 50ft Long Reach, Rock Breaker, BharatBenz Tipper & Blasting Services.",
  
  // Contact Details (Matching official business logo)
  phone: "+91 9944745410",              // Official Contact Number
  phoneSecondary: "+91 94433 12345",     // [PLACEHOLDER - Site Manager Contact]
  whatsapp: "+91 9944745410",          // Official WhatsApp Number
  email: "srivenkateshwaravechicles@gmail.com",
  
  // Location Placeholders
  address: "NH-44 Bypass Road, Industrial Estate, Salem - Namakkal Highway, Tamil Nadu 637001", // [PLACEHOLDER]
  city: "Namakkal / Salem",
  state: "Tamil Nadu",
  country: "India",
  pincode: "637001",
  workingHours: "Monday - Sunday: 6:00 AM - 10:00 PM",
  emergencySupport: "24/7 Breakdown Assistance & Operator Support",
  
  // Service Coverage Area
  serviceArea: "Tamil Nadu, Kerala, Andhra Pradesh & Karnataka",
  serviceStates: [
    "Tamil Nadu",
    "Kerala",
    "Andhra Pradesh",
    "Karnataka"
  ],
  
  // Social & Map Links
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.42398516244!2d78.07722425!3d11.218889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babce281315e985%3A0xa1969a2399999a0!2sNamakkal%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  
  // Trust Badges
  trustPoints: [
    {
      title: "Well-Maintained Machinery",
      desc: "Regularly serviced with OEM certified spare parts & genuine lubricants."
    },
    {
      title: "Reliable & Safe Operation",
      desc: "Licensed heavy machinery operators with 8+ years on-site experience."
    },
    {
      title: "Flexible Rental Options",
      desc: "Transparent hourly, daily, weekly, or project-based packages."
    },
    {
      title: "Quick Availability & Support",
      desc: "Rapid on-site mobilization and prompt backup machine replacement."
    }
  ]
};

/**
 * Generate formatted WhatsApp URL with prefilled text
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const cleanPhone = BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '');
  const message = customMessage || `Hello Sri Venkateshwara Earth Movers, I am interested in inquiring about equipment rental for my construction project.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface BookingCustomerDetails {
  name?: string;
  phone?: string;
  location?: string;
  rentalType?: string;
  notes?: string;
}

/**
 * Generate WhatsApp URL with prefilled message containing selected equipment, dates, and project details.
 */
export function getEquipmentBookingWhatsAppUrl(
  equipmentName: string,
  startDateStr?: string,
  endDateStr?: string,
  details?: BookingCustomerDetails
): string {
  const start = startDateStr ? formatDateDisplay(startDateStr) : '[START DATE]';
  const end = endDateStr ? formatDateDisplay(endDateStr) : start;
  const dateText = start === end ? `on ${start}` : `from ${start} to ${end}`;

  const parts = [
    `Hello Sri Venkateshwara Earth Movers, I want to book the ${equipmentName} ${dateText}.`
  ];

  if (details?.rentalType) parts.push(`Shift: ${details.rentalType}.`);
  if (details?.location) parts.push(`Location: ${details.location}.`);
  if (details?.name) parts.push(`Name: ${details.name}${details.phone ? ` (${details.phone})` : ''}.`);
  if (details?.notes) parts.push(`Work: ${details.notes}.`);
  parts.push(`Please confirm availability and rental tariff.`);

  return getWhatsAppUrl(parts.join(' '));
}

/**
 * Generate formatted Mailto URL for Equipment Booking & Quote Enquiry
 */
export function getEquipmentBookingMailtoUrl(
  equipmentName: string,
  startDateStr?: string,
  endDateStr?: string,
  details?: BookingCustomerDetails
): string {
  const start = startDateStr ? formatDateDisplay(startDateStr) : 'Immediate';
  const end = endDateStr ? formatDateDisplay(endDateStr) : start;
  const duration = start === end ? `${start} (1 Day)` : `${start} to ${end}`;
  const subject = `Machinery Rental & Quote Enquiry: ${equipmentName} (${duration})`;

  const bodyLines = [
    `To: Sri Venkateshwara Earth Movers (${BUSINESS_INFO.phone})`,
    `Email: ${BUSINESS_INFO.email}`,
    ``,
    `Dear Sri Venkateshwara Earth Movers Team,`,
    ``,
    `I would like to inquire about booking the following heavy construction machinery:`,
    `----------------------------------------------------`,
    `Equipment:       ${equipmentName}`,
    `Rental Duration: ${duration}`,
    `Rental Shift:    ${details?.rentalType || 'Daily Shift (8 hrs)'}`,
    `Project Location:${details?.location || 'Tamil Nadu / Surrounding Districts'}`,
    `----------------------------------------------------`,
    `Contact Name:    ${details?.name || 'Customer'}`,
    `Contact Phone:   ${details?.phone || 'Not Specified'}`,
    ...(details?.notes ? [`Work Details:    ${details.notes}`] : []),
    `----------------------------------------------------`,
    ``,
    `Please share availability, operator mobilization timeline, and official rental quotation.`,
    ``,
    `Thank you.`
  ];

  return `mailto:${BUSINESS_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
}

/**
 * Generate direct Call URL
 */
export function getCallUrl(): string {
  const cleanPhone = BUSINESS_INFO.phone.replace(/[^0-9+]/g, '');
  return `tel:${cleanPhone}`;
}

/**
 * Generate WhatsApp URL to directly inquire with the owner for equipment rates/tariff
 */
export function getEquipmentTariffWhatsAppUrl(equipmentName: string): string {
  const message = `Hello Sri Venkateshwara Earth Movers, I want to inquire about the rental tariff and operator availability for the ${equipmentName}. Please share details.`;
  return getWhatsAppUrl(message);
}
