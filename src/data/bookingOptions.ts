/**
 * Curated Locations and Work Types for Sri Venkateshwara Earth Movers
 */

export interface LocationOptionGroup {
  label: string;
  options: string[];
}

export const LOCATION_GROUPS: LocationOptionGroup[] = [
  {
    label: 'Primary Tamil Nadu Hubs',
    options: [
      'Salem',
      'Namakkal',
      'Dharmapuri',
      'Erode',
      'Coimbatore',
      'Tirupur',
      'Karur',
      'Trichy (Tiruchirappalli)',
      'Hosur / Krishnagiri',
      'Madurai',
      'Dindigul',
      'Chennai & Kanchipuram',
    ],
  },
  {
    label: 'Inter-State Mobilization Zones',
    options: [
      'Bengaluru & Surrounds (Karnataka)',
      'Palakkad & Kochi (Kerala)',
      'Chittoor & Tirupati (Andhra Pradesh)',
    ],
  },
];

export const WORK_TYPE_OPTIONS: string[] = [
  'Earth Excavation & Foundation Trenching',
  'Hard Rock Breaking & Demolition',
  'Pipeline, Canal & Drainage Trenching',
  'Site Levelling, Land Clearing & Grading',
  'Bulk Earth Filling & Red Soil Supply',
  'Road Sub-base, Gravel & Compaction',
  'Deep Pond & Well Excavation (50ft Long Reach)',
  'Controlled Rock Blasting & Drilling',
  'Heavy Debris Haulage (Tipper Lorries)',
];
