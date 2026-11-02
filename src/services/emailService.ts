import emailjs from '@emailjs/browser';
import type { Booking } from '../types';
import { BUSINESS_INFO, getEquipmentBookingMailtoUrl } from '../config/businessInfo';
import { formatDateDisplay } from '../utils/dateUtils';

export interface EmailSendResult {
  success: boolean;
  status: 'sent' | 'fallback' | 'not_configured' | 'error';
  message: string;
}

/**
 * EmailJS Configuration loaded from Vite environment variables.
 * Define these variables in `.env` (or `.env.local`):
 *   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
 *   VITE_EMAILJS_TO_EMAIL=srivenkateshwaravechicles@gmail.com
 */
export const EMAILJS_CONFIG = {
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID || '').trim(),
  templateId: (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '').trim(),
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '').trim(),
  toEmail: (import.meta.env.VITE_EMAILJS_TO_EMAIL || BUSINESS_INFO.email).trim(),
};

/**
 * Returns true if all required EmailJS keys are provided and not placeholders.
 */
export const isEmailJsConfigured = (): boolean => {
  const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;
  return Boolean(
    serviceId &&
    templateId &&
    publicKey &&
    !serviceId.includes('your_') &&
    !serviceId.includes('YOUR_') &&
    !templateId.includes('your_') &&
    !templateId.includes('YOUR_') &&
    !publicKey.includes('your_') &&
    !publicKey.includes('YOUR_')
  );
};

/**
 * Dispatches the booking enquiry directly to the owner email via EmailJS browser SDK.
 * If credentials are not yet set or if the network request fails, it gracefully falls back
 * to pre-filling the user's default email client via `mailto:` so no booking is ever lost.
 */
export const sendBookingEmail = async (booking: Booking): Promise<EmailSendResult> => {
  const startFormatted = formatDateDisplay(booking.startDate);
  const endFormatted = formatDateDisplay(booking.endDate);

  if (isEmailJsConfigured()) {
    try {
      const rawPhone = booking.phoneNumber.replace(/\D/g, '');
      const waDigits = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
      const ownerWaReplyText = encodeURIComponent(
        `Hello ${booking.customerName}, regarding your booking request ${booking.id} for ${booking.equipmentName} at Sri Venkateshwara Earth Movers.`
      );
      const ownerCustomerWhatsAppUrl = `https://wa.me/${waDigits}?text=${ownerWaReplyText}`;
      const customerTelUrl = `tel:${rawPhone}`;

      const templateParams: Record<string, unknown> = {
        to_email: EMAILJS_CONFIG.toEmail,
        to_name: 'Sri Venkateshwara Earth Movers (Fleet Management)',
        booking_id: booking.id,
        equipment_name: booking.equipmentName,
        customer_name: booking.customerName,
        customer_phone: booking.phoneNumber,
        customer_email: booking.email || 'Not provided',
        rental_type: booking.rentalType,
        project_location: booking.projectLocation,
        start_date: startFormatted,
        end_date: endFormatted,
        rental_duration: `${startFormatted} to ${endFormatted} (${booking.rentalType})`,
        additional_notes: booking.additionalRequirements || 'None specified',
        booking_date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        // Quick Action URLs for Yard Owner inside Gmail
        customer_phone_raw: rawPhone,
        customer_tel_url: customerTelUrl,
        customer_whatsapp_url: ownerCustomerWhatsAppUrl,
        // Aliases for default EmailJS template compatibility
        name: booking.customerName,
        email: booking.email || 'Not provided',
        phone: booking.phoneNumber,
        message: `Equipment: ${booking.equipmentName}\nDuration: ${startFormatted} to ${endFormatted} (${booking.rentalType})\nLocation: ${booking.projectLocation}\nNotes: ${booking.additionalRequirements || 'None'}`,
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      return {
        success: true,
        status: 'sent',
        message: `Booking email successfully delivered to ${EMAILJS_CONFIG.toEmail} (Status: ${response.status})`,
      };
    } catch (err: unknown) {
      const errObj = (err && typeof err === 'object') ? (err as Record<string, unknown>) : {};
      const errDetail = String(errObj.text || errObj.message || 'EmailJS connection issue');
      console.warn('[EmailJS] Automated dispatch encountered an issue, triggering mailto fallback:', err);
      triggerMailtoFallback(booking);
      return {
        success: false,
        status: 'error',
        message: errDetail,
      };
    }
  }

  // Graceful fallback when credentials have not been configured yet
  console.info(
    '[EmailJS] Credentials not configured in .env. Pre-filling client mailto to ' +
    EMAILJS_CONFIG.toEmail
  );
  triggerMailtoFallback(booking);
  return {
    success: true,
    status: 'not_configured',
    message: `Pre-filled email client triggered for ${EMAILJS_CONFIG.toEmail}. Add EmailJS keys in .env to enable background dispatch.`,
  };
};

/**
 * Triggers user's native email client with pre-filled booking details to srivenkateshwaravechicles@gmail.com
 */
export const triggerMailtoFallback = (booking: Booking): void => {
  const mailtoUrl = getEquipmentBookingMailtoUrl(
    booking.equipmentName,
    booking.startDate,
    booking.endDate,
    {
      name: booking.customerName,
      phone: booking.phoneNumber,
      location: booking.projectLocation,
      rentalType: booking.rentalType,
      notes: `Booking Reference: ${booking.id}${booking.additionalRequirements ? ` | ${booking.additionalRequirements}` : ''}`,
    }
  );

  try {
    if (typeof window !== 'undefined') {
      window.location.href = mailtoUrl;
    }
  } catch {
    // browser sandbox fallback
  }
};

export interface ContactMessagePayload {
  name: string;
  phone: string;
  email?: string;
  service: string;
  location: string;
  message: string;
}

/**
 * Dispatches contact messages to the owner via EmailJS (or fallback)
 */
export const sendContactEmail = async (payload: ContactMessagePayload): Promise<EmailSendResult> => {
  if (isEmailJsConfigured()) {
    try {
      const templateParams: Record<string, unknown> = {
        to_email: EMAILJS_CONFIG.toEmail,
        to_name: 'Sri Venkateshwara Earth Movers (Fleet Management)',
        customer_name: payload.name,
        customer_phone: payload.phone,
        customer_email: payload.email || 'Not provided',
        service_required: payload.service,
        project_location: payload.location,
        message: payload.message,
        booking_date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      return {
        success: true,
        status: 'sent',
        message: `Contact enquiry sent to ${EMAILJS_CONFIG.toEmail} (Status: ${response.status})`,
      };
    } catch (err: unknown) {
      console.warn('[EmailJS] Contact dispatch error:', err);
      return {
        success: false,
        status: 'error',
        message: 'EmailJS contact dispatch failed.',
      };
    }
  }

  return {
    success: true,
    status: 'not_configured',
    message: 'EmailJS keys not configured in .env',
  };
};
