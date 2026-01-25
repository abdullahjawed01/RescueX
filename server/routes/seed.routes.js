import express from "express";
import Hospital from "../models/Hospital.js";
import Ambulance from "../models/Ambulance.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import crypto from "crypto";

const router = express.Router();

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomOffset = () => (Math.random() - 0.5) * 0.04; 
const randomPhone = () => `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;

const hospitalNames = [
  "City General Medical", "St. Luke's Trauma Center", "Mercy Health Institute", "Beacon Pediatric Hospital",
  "Grandview Critical Care", "Highland Orthopedics", "Sunrise Heart Clinic", "Westside Trauma Unit"
];

const specialtiesList = ["Cardiology", "Trauma", "Neurology", "Pediatrics", "Emergency Medicine"];
const driverNames = ["Alex Johnson", "Maya Smith", "Chris Evans", "David Miller", "Emma Wilson", "Frank Castle"];

router.post("/run", async (req, res) => {
  try {
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    
    if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ error: "Coordinates required" });

    await Hospital.deleteMany({});
    await Ambulance.deleteMany({});
    await AuditLog.deleteMany({});

    await Hospital.syncIndexes();
    await Ambulance.syncIndexes();

    const genesisHash = crypto.createHash('sha256').update('rescuex-genesis').digest('hex');
    await AuditLog.create({ 
      action: "GENESIS", 
      details: "System Initialized", 
      hash: genesisHash 
    });

    const hospitals = Array.from({ length: 8 }).map((_, i) => ({
      name: hospitalNames[i] || `Hospital ${i+1}`,
      address: `${Math.floor(Math.random() * 900) + 100} Main Ave`,
      phone: randomPhone(),
      specialties: [randomItem(specialtiesList), randomItem(specialtiesList)],
      bedsAvailable: Math.floor(Math.random() * 50),
      rating: (4 + Math.random()).toFixed(1),
      location: { type: "Point", coordinates: [lng + randomOffset(), lat + randomOffset()] }
    }));

    const ambulances = Array.from({ length: 10 }).map((_, i) => ({
      name: `LifeSupport ${101+i}`,
      driverName: randomItem(driverNames),
      plateNumber: `AMB-${Math.floor(Math.random() * 9000) + 1000}`,
      phone: randomPhone(),
      type: i % 3 === 0 ? "ICU" : i % 5 === 0 ? "Air" : "Basic",
      isAvailable: true,
      availabilityStreak: Math.floor(Math.random() * 50) + 50,
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
      location: { type: "Point", coordinates: [lng + randomOffset(), lat + randomOffset()] }
    }));

    await Hospital.insertMany(hospitals);
    await Ambulance.insertMany(ambulances);

    let demoUser = await User.findOne({ name: "Abdullah Jawed" });

    if (!demoUser) {
      await User.create({
        name: "Abdullah Jawed",
        phone: "+1 555-0321",
        medicalID: {
          bloodGroup: "O+",
          allergies: ["Peanuts", "Dust"],
          conditions: ["None"],
          medications: ["Vitamins"]
        },
        emergencyContacts: [
          { name: "Emergency Contact 1", phone: "+1 555-9876", relation: "Sibling" }
        ]
      });
    }

    res.json({ message: "Production-ready seeding complete", count: { hospitals: 8, ambulances: 10 } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
