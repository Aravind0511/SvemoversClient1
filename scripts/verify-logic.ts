import { INITIAL_BOOKINGS } from '../src/data/initialBookings.ts';
import { EQUIPMENT_LIST } from '../src/data/equipmentData.ts';
import {
  isDateBooked,
  findConflictingBooking,
  generateMonthGrid,
  formatDateISO,
  formatDateDisplay,
  isDateBetween
} from '../src/utils/dateUtils.ts';
import fs from 'node:fs';
import path from 'node:path';
import { BUSINESS_INFO, getCallUrl, getWhatsAppUrl, getEquipmentBookingWhatsAppUrl, getEquipmentBookingMailtoUrl } from '../src/config/businessInfo.ts';
import { parseRoute, getRouteHash, VALID_ROUTES } from '../src/utils/routeUtils.ts';
import { SERVICES_LIST } from '../src/data/servicesData.ts';
import { GALLERY_ITEMS } from '../src/data/galleryData.ts';

console.log('=== RUNNING VERIFICATION SUITE FOR SRI VENKATESHWARA EARTH MOVERS ===\n');

let failedTests = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

// 1. Verify Equipment Data
assert(EQUIPMENT_LIST.length === 9, 'Equipment list has exactly 9 items including Complete Fleet Package');
const fullFleet = EQUIPMENT_LIST.find(e => e.id === 'all-vehicles-fleet');
assert(fullFleet && fullFleet.status === 'available', 'Complete Fleet Package (All Vehicles) is available');

const jcb = EQUIPMENT_LIST.find(e => e.id === 'jcb-3dx');
assert(jcb && jcb.status === 'available', 'JCB 3DX is available');

const hitachi140 = EQUIPMENT_LIST.find(e => e.id === 'hitachi-140');
assert(hitachi140 && hitachi140.status === 'available', 'Hitachi 140 Excavator is available');

const hitachi215 = EQUIPMENT_LIST.find(e => e.id === 'hitachi-215');
assert(hitachi215 && hitachi215.status === 'available', 'Hyundai Robex 215L Excavator is available');

const hitachi220 = EQUIPMENT_LIST.find(e => e.id === 'hitachi-220');
assert(hitachi220 && hitachi220.status === 'available', 'Hitachi ZAXIS 220LC Quarry Excavator is available');

const longReach = EQUIPMENT_LIST.find(e => e.id === 'hitachi-long-reach-50ft');
assert(longReach && longReach.status === 'available', '50 Feet Long Reach Hitachi Excavator is available');

const breaker = EQUIPMENT_LIST.find(e => e.id === 'rock-breaker');
assert(breaker && breaker.status === 'available', 'Excavator with Heavy Rock Breaker is available');

const tipper = EQUIPMENT_LIST.find(e => e.id === 'tipper-lorry');
assert(tipper && tipper.status === 'available', 'BharatBenz Heavy Tipper Lorry is available');

const blasting = EQUIPMENT_LIST.find(e => e.id === 'compressor-blasting');
assert(blasting && blasting.status === 'available', 'Tractor Compressor & Controlled Blasting Unit is available');

// 2. Verify Initial Bookings & Availability on Oct 14, 2026 (Mockup requirement)
assert(
  isDateBooked('jcb-3dx', '2026-10-14', INITIAL_BOOKINGS),
  'JCB 3DX is booked on 2026-10-14 (matching reference UI)'
);
assert(
  !isDateBooked('jcb-3dx', '2026-10-12', INITIAL_BOOKINGS),
  'JCB 3DX is available on 2026-10-12'
);
assert(
  !isDateBooked('jcb-3dx', '2026-10-13', INITIAL_BOOKINGS),
  'JCB 3DX is available on 2026-10-13'
);

// 3. Verify Range Conflict Detection
const conflict1 = findConflictingBooking('jcb-3dx', '2026-10-12', '2026-10-14', INITIAL_BOOKINGS);
assert(
  conflict1 !== null && conflict1.startDate === '2026-10-14',
  'Range 2026-10-12 to 2026-10-14 conflicts with Oct 14 booking'
);

const conflict2 = findConflictingBooking('jcb-3dx', '2026-10-11', '2026-10-13', INITIAL_BOOKINGS);
assert(
  conflict2 === null,
  'Range 2026-10-11 to 2026-10-13 is completely available with zero conflicts'
);

// 4. Verify Overlap Spanning Across a Booked Date
const conflict3 = findConflictingBooking('jcb-3dx', '2026-10-13', '2026-10-15', INITIAL_BOOKINGS);
assert(
  conflict3 !== null,
  'Range 2026-10-13 to 2026-10-15 detects booked date on Oct 14 in the middle'
);

// 5. Verify Calendar Grid Generation for October 2026
// Month index 9 = October
const grid = generateMonthGrid(2026, 9, 'jcb-3dx', INITIAL_BOOKINGS, '2026-10-12', '2026-10-14');
assert(grid.length === 35 || grid.length === 42, `Calendar grid contains ${grid.length} day cells`);

const oct14Cell = grid.find(c => c.dateString === '2026-10-14');
assert(oct14Cell && oct14Cell.isBooked === true, 'Oct 14 cell is correctly flagged as isBooked = true');

const oct12Cell = grid.find(c => c.dateString === '2026-10-12');
assert(oct12Cell && oct12Cell.isSelected === true, 'Oct 12 cell is marked as isSelected = true');

// 6. Verify Date Formatter
assert(formatDateISO(new Date(2026, 9, 14)) === '2026-10-14', 'formatDateISO converts Date to YYYY-MM-DD');
assert(formatDateDisplay('2026-10-14') === 'Oct 14, 2026', 'formatDateDisplay converts YYYY-MM-DD to Oct 14, 2026');
assert(isDateBetween('2026-10-13', '2026-10-12', '2026-10-14') === true, 'isDateBetween checks inclusivity');

// 7. Verify Official Logo & Business Info Integrity
const logoPath = path.resolve('public', 'logo.jpg');
assert(fs.existsSync(logoPath), 'Official logo exists in public/logo.jpg');
assert(fs.statSync(logoPath).size > 10000, 'Official logo is non-empty and high-resolution');

assert(BUSINESS_INFO.phone === '+91 9944745410', 'Business phone matches owner number (+91 9944745410)');
assert(getCallUrl() === 'tel:+919944745410', 'Call URL is formatted correctly to owner');
assert(getWhatsAppUrl().includes('919944745410'), 'WhatsApp URL points to owner number');

// 7b. Verify WhatsApp & Email Equipment Booking URLs
const sampleWa = getEquipmentBookingWhatsAppUrl('JCB 3DX', '2026-10-12', '2026-10-13', {
  name: 'Ramesh',
  phone: '9876543210',
  location: 'Salem',
  rentalType: 'Daily'
});
assert(sampleWa.includes('919944745410'), 'WhatsApp booking URL includes owner mobile number');
assert(decodeURIComponent(sampleWa).includes('JCB 3DX'), 'WhatsApp booking URL pre-fills equipment name');

const sampleEmail = getEquipmentBookingMailtoUrl('JCB 3DX', '2026-10-12', '2026-10-13', {
  name: 'Ramesh',
  phone: '9876543210',
  location: 'Salem'
});
assert(sampleEmail.startsWith('mailto:' + BUSINESS_INFO.email), 'Equipment Email URL points to official business email');
assert(decodeURIComponent(sampleEmail).includes('JCB 3DX'), 'Email booking URL pre-fills equipment and subject');

// 8. Verify No Monetary Amounts in Equipment Rates & Local Equipment Assets Exist
const equipmentImages = [
  'all-vehicles-fleet.jpg',
  'all-vehicles-fleet-v2.jpg',
  'hitachi-140.jpg',
  'hitachi-215.jpg',
  'hitachi-220.jpg',
  'hitachi-long-reach-50ft.jpg',
  'hitachi-50ft-long-reach-v2.jpg',
  'rock-breaker.jpg',
  'tipper-lorry.jpg',
  'compressor-blasting.jpg',
  'jcb-3dx.jpg'
];

for (const eqImg of equipmentImages) {
  const eqPath = path.resolve('public/equipment', eqImg);
  const exists = fs.existsSync(eqPath);
  assert(exists, `Local equipment image ${eqImg} exists in public/equipment`);
  if (exists) {
    const stat = fs.statSync(eqPath);
    assert(stat.size > 5000, `Equipment image ${eqImg} is non-empty (${stat.size} bytes)`);
  }
}

// Verify dedicated 50ft service image exists
const serviceImgPath = path.resolve('public/services/50ft-long-reach-service.jpg');
assert(fs.existsSync(serviceImgPath), 'Dedicated 50ft long reach service image exists in public/services');
assert(fs.statSync(serviceImgPath).size > 5000, 'Dedicated 50ft long reach service image is non-empty');

for (const item of EQUIPMENT_LIST) {
  const eqImgName = path.basename(item.image.split('?')[0]);
  const fullEqPath = path.resolve('public/equipment', eqImgName);
  assert(fs.existsSync(fullEqPath), `Configured equipment image ${eqImgName} exists on disk`);
  assert(!item.rates.daily.includes('₹'), `No monetary currency symbol in ${item.name} daily rate`);
  assert(!item.rates.hourly.includes('₹'), `No monetary currency symbol in ${item.name} hourly rate`);
  assert(!item.rates.weekly.includes('₹'), `No monetary currency symbol in ${item.name} weekly rate`);
  assert(!item.rates.project.includes('₹'), `No monetary currency symbol in ${item.name} project rate`);
  assert(!item.rates.daily.includes('Rs'), `No Rs in ${item.name} daily rate`);
  assert(!item.rates.daily.includes('INR'), `No INR in ${item.name} daily rate`);
}

// 9. Verify Worksite Gallery Assets
assert(GALLERY_ITEMS.length === 12, 'Gallery contains exactly 12 authentic worksite photos including 50ft Long Reach');
for (const item of GALLERY_ITEMS) {
  const fileName = path.basename(item.image.split('?')[0]);
  const fullPath = path.resolve('public/gallery', fileName);
  const exists = fs.existsSync(fullPath);
  assert(exists, `Gallery image ${item.title} exists in public/gallery (${fileName})`);
  if (exists) {
    const stat = fs.statSync(fullPath);
    assert(stat.size > 5000, `Gallery image ${fileName} is non-empty (${stat.size} bytes)`);
  }
}

// 9b. Verify Service Coverage States
assert(BUSINESS_INFO.serviceArea.includes('Tamil Nadu'), 'serviceArea includes Tamil Nadu');
assert(BUSINESS_INFO.serviceArea.includes('Kerala'), 'serviceArea includes Kerala');
assert(BUSINESS_INFO.serviceArea.includes('Andhra Pradesh'), 'serviceArea includes Andhra Pradesh');
assert(BUSINESS_INFO.serviceArea.includes('Karnataka'), 'serviceArea includes Karnataka');
assert(BUSINESS_INFO.serviceStates.includes('Tamil Nadu'), 'serviceStates includes Tamil Nadu');
assert(BUSINESS_INFO.serviceStates.includes('Kerala'), 'serviceStates includes Kerala');
assert(BUSINESS_INFO.serviceStates.includes('Andhra Pradesh'), 'serviceStates includes Andhra Pradesh');
assert(BUSINESS_INFO.serviceStates.includes('Karnataka'), 'serviceStates includes Karnataka');

// 10. Verify All 7 Dedicated Routes & Route Parsing
assert(VALID_ROUTES.length === 7, 'Exactly 7 dedicated routes configured');
assert(VALID_ROUTES.includes('home'), 'Route home exists');
assert(VALID_ROUTES.includes('about'), 'Route about exists');
assert(VALID_ROUTES.includes('equipment'), 'Route equipment exists');
assert(VALID_ROUTES.includes('services'), 'Route services exists');
assert(VALID_ROUTES.includes('gallery'), 'Route gallery exists');
assert(VALID_ROUTES.includes('booking'), 'Route booking exists');
assert(VALID_ROUTES.includes('contact'), 'Route contact exists');

// Route parsing assertions
assert(parseRoute('#/') === 'home', 'Parse #/ maps to home');
assert(parseRoute('') === 'home', 'Parse empty hash maps to home');
assert(parseRoute('#home') === 'home', 'Parse #home maps to home');
assert(parseRoute('#/about') === 'about', 'Parse #/about maps to about');
assert(parseRoute('#/equipment') === 'equipment', 'Parse #/equipment maps to equipment');
assert(parseRoute('#/services') === 'services', 'Parse #/services maps to services');
assert(parseRoute('#/gallery') === 'gallery', 'Parse #/gallery maps to gallery');
assert(parseRoute('#/booking') === 'booking', 'Parse #/booking maps to booking');
assert(parseRoute('#/contact') === 'contact', 'Parse #/contact maps to contact');

// Route hash generator assertions
assert(getRouteHash('home') === '#/', 'getRouteHash for home returns #/');
assert(getRouteHash('about') === '#/about', 'getRouteHash for about returns #/about');
assert(getRouteHash('equipment') === '#/equipment', 'getRouteHash for equipment returns #/equipment');
assert(getRouteHash('services') === '#/services', 'getRouteHash for services returns #/services');
assert(getRouteHash('gallery') === '#/gallery', 'getRouteHash for gallery returns #/gallery');
assert(getRouteHash('booking') === '#/booking', 'getRouteHash for booking returns #/booking');
assert(getRouteHash('contact') === '#/contact', 'getRouteHash for contact returns #/contact');

// Verify 6 Services in SERVICES_LIST
assert(SERVICES_LIST.length === 6, 'Services list contains 6 specialized earthwork services');
const excavationServ = SERVICES_LIST.find(s => s.id === 'earth-excavation');
assert(excavationServ && excavationServ.suitableEquipment.length > 0, 'Earth excavation has assigned machinery');
const rockBreakerServ = SERVICES_LIST.find(s => s.id === 'rock-breaking-blasting');
assert(rockBreakerServ && rockBreakerServ.suitableEquipment.length > 0, 'Rock breaking & blasting has assigned machinery');
const longReachServ = SERVICES_LIST.find(s => s.id === 'long-reach-excavation');
assert(longReachServ && longReachServ.suitableEquipment.length > 0, 'Long reach excavation has assigned machinery');
const demoServ = SERVICES_LIST.find(s => s.id === 'building-demolition');
assert(demoServ && demoServ.suitableEquipment.length > 0, 'Building Demolition has assigned machinery');
const fillingServ = SERVICES_LIST.find(s => s.id === 'earth-filling');
assert(fillingServ && fillingServ.suitableEquipment.length > 0, 'Earth filling has assigned machinery');
const haulageServ = SERVICES_LIST.find(s => s.id === 'bulk-haulage');
assert(haulageServ && haulageServ.suitableEquipment.length > 0, 'Bulk haulage has assigned machinery');

if (failedTests > 0) {
  console.error(`\n❌ Total test failures: ${failedTests}`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
}
