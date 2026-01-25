import mongoose from "mongoose";
import dotenv from "dotenv";
import Ambulance from "./models/Ambulance.js";
import Hospital from "./models/Hospital.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rescueXDB";

// Replace these with your actual current location (browser geolocation or manual)
const CURRENT_LAT = 12.9716;   // Your latitude
const CURRENT_LNG = 77.5946;   // Your longitude

// Helper: generate random nearby coordinate within ~2 km
const randomOffset = () => (Math.random() - 0.5) * 0.02; // ~1 km offset

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing data
    await Ambulance.deleteMany({});
    await Hospital.deleteMany({});

    // Seed hospitals near current location
    const hospitals = [
      {
        name: "City Hospital",
        address: "123 Main St",
        location: {
          type: "Point",
          coordinates: [CURRENT_LNG + randomOffset(), CURRENT_LAT + randomOffset()]
        }
      },
      {
        name: "Green Valley Hospital",
        address: "45 Park Ave",
        location: {
          type: "Point",
          coordinates: [CURRENT_LNG + randomOffset(), CURRENT_LAT + randomOffset()]
        }
      },
      {
        name: "Sunrise Medical Center",
        address: "78 Lake Rd",
        location: {
          type: "Point",
          coordinates: [CURRENT_LNG + randomOffset(), CURRENT_LAT + randomOffset()]
        }
      }
    ];

    await Hospital.insertMany(hospitals);
    console.log("✅ Hospitals seeded");

    // Seed ambulances near current location
    const ambulances = [
      {
        name: "Ambulance A1",
        isAvailable: true,
        location: {
          type: "Point",
          coordinates: [CURRENT_LNG + randomOffset(), CURRENT_LAT + randomOffset()]
        }
      },
      {
        name: "Ambulance B2",
        isAvailable: true,
        location: {
          type: "Point",
          coordinates: [CURRENT_LNG + randomOffset(), CURRENT_LAT + randomOffset()]
        }
      },
      {
        name: "Ambulance C3",
        isAvailable: true,
        location: {
          type: "Point",
          coordinates: [CURRENT_LNG + randomOffset(), CURRENT_LAT + randomOffset()]
        }
      }
    ];

    await Ambulance.insertMany(ambulances);
    console.log("✅ Ambulances seeded");

    console.log("🎉 Seeding completed! All hospitals and ambulances are now within ~1 km of your location.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
