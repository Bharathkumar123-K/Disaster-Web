const { faker } = require('@faker-js/faker');
const ClassifiedEvent = require('../models/ClassifiedEvent');
const Recommendation = require('../models/Recommendation');

const indianLocations = [
  { city: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777, text: 'Heavy monsoon downpour causing severe waterlogging and flash floods at Dadar and Hindmata junction.', category: 'flood' },
  { city: 'New Delhi, Delhi NCR', lat: 28.6139, lng: 77.2090, text: 'Major electrical fire breakout at commercial warehouse in Okhla Phase 3. Thicker smoke spreading.', category: 'fire' },
  { city: 'Wayanad, Kerala', lat: 11.6050, lng: 76.0830, text: 'Massive landslide and torrential rain alert triggered in Meppadi region. Emergency rescue deployed.', category: 'flood' },
  { city: 'Guwahati, Assam', lat: 26.1445, lng: 91.7362, text: 'Brahmaputra river flowing above danger mark causing inundation across low-lying districts.', category: 'flood' },
  { city: 'Puri, Odisha', lat: 19.8135, lng: 85.8312, text: 'Cyclonic storm alert with coastal wind speeds reaching 85 km/h. Evacuation underway.', category: 'cyclone' },
  { city: 'Shimla, Himachal Pradesh', lat: 31.1048, lng: 77.1734, text: 'Cloudburst near Beas river basin causing highway collapse and rockslides blocking NH-21.', category: 'collapse' },
  { city: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, text: 'Severe urban flooding on Outer Ring Road causing massive traffic gridlock and sub-station outage.', category: 'roadblock' },
  { city: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707, text: 'Coastal waterlogging and high tide alert near Velachery and Tambaram residential zones.', category: 'flood' },
  { city: 'Coimbatore, Tamil Nadu', lat: 11.0168, lng: 76.9558, text: 'Heavy squall winds causing fallen trees and power line grid collapse across RS Puram.', category: 'roadblock' },
  { city: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639, text: 'Hooghly river water rise combined with heavy rains inundates Central Kolkata avenues.', category: 'flood' },
  { city: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867, text: 'Heavy thunderstorm causing Hussain Sagar lake overflow alert and tree uprooting.', category: 'flood' },
  { city: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714, text: 'Chemical hazmat leak reported at industrial unit in Naroda GIDC. Fire tenders dispatched.', category: 'fire' },
  { city: 'Kochi, Kerala', lat: 9.9312, lng: 76.2673, text: 'High swell waves and coastal erosion inundating low-lying fishing villages at Chellanam.', category: 'flood' },
  { city: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873, text: 'Sudden flash flood in low-lying walled city area following cloudburst near Amer hills.', category: 'flood' },
  { city: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, text: 'Deep depression in Bay of Bengal triggering gale winds and heavy coastal downpour.', category: 'cyclone' }
];

const severities = ['low', 'medium', 'high', 'critical'];
const depts = ['NDRF', 'SDRF', 'Fire', 'Ambulance', 'Police', 'Coast Guard'];

async function processRawPost(rawPost) {
  // Pick random Indian location template
  const locObj = faker.helpers.arrayElement(indianLocations);
  const severity = faker.helpers.arrayElement(severities);
  
  // Add small random offset around city center
  const lat = locObj.lat + (Math.random() - 0.5) * 0.1;
  const lng = locObj.lng + (Math.random() - 0.5) * 0.1;

  const classified = await ClassifiedEvent.create({
    rawPostId: rawPost._id,
    sourceType: rawPost.source,
    text: locObj.text,
    url: rawPost.url || 'https://disaster.gov.in',
    category: locObj.category,
    location: { type: 'Point', coordinates: [lng, lat] },
    locationName: locObj.city,
    severity,
    peopleAffected: faker.number.int({ min: 10, max: 1200 }),
    confidenceScore: faker.number.int({ min: 65, max: 98 }),
    status: 'pending'
  });

  // Simulate Recommendation Engine
  let priorityLevel = 'routine';
  if (severity === 'high') priorityLevel = 'urgent';
  if (severity === 'critical') priorityLevel = 'emergency';

  const recommendation = await Recommendation.create({
    eventId: classified._id,
    suggestedDepartment: faker.helpers.arrayElement(depts),
    priorityLevel,
    suggestedResources: [faker.helpers.arrayElement(['2x Rescue Boats', '4x Fire Tenders', '3x 108 Ambulances', 'SDRF Flood Unit', 'Chopper Support'])]
  });

  return { classified, recommendation };
}

module.exports = { processRawPost };
