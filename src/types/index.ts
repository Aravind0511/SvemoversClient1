export type AppPage = 'home' | 'about' | 'equipment' | 'services' | 'gallery' | 'booking' | 'contact';

export type AvailabilityStatus = 'available' | 'rented';

export interface EquipmentSpecs {
  operatingWeight?: string;
  enginePower?: string;
  bucketCapacity?: string;
  diggingDepth?: string;
  payloadCapacity?: string;
  fuelCapacity?: string;
  transmission?: string;
  drumWidth?: string;
  reach?: string;
  impactRate?: string;
  chiselDiameter?: string;
  hydraulicFlow?: string;
  compressorCapacity?: string;
}

export interface EquipmentRates {
  hourly: string;
  daily: string;
  weekly: string;
  project: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  category: string;
  model: string;
  shortDesc: string;
  fullDesc: string;
  status: AvailabilityStatus;
  statusText: string;
  image: string;
  specs: EquipmentSpecs;
  rates: EquipmentRates;
  applications: string[];
  operatorIncluded: boolean;
  minRentalHours: number;
}

export type RentalType = 'Hourly' | 'Daily' | 'Weekly' | 'Project Based';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  rentalType: RentalType;
  projectLocation: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  additionalRequirements?: string;
  status: BookingStatus;
  createdAt: string;
  emailStatus?: 'pending' | 'sent' | 'fallback' | 'not_configured' | 'error';
  emailError?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: 'excavation' | 'filling' | 'road' | 'demolition' | 'development' | 'breaker' | 'blasting' | 'reach' | 'haulage';
  suitableEquipment: string[];
  features: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  description: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  projectType: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isBooked: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}
