import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  driverName: { type: String, required: true },
  plateNumber: { type: String, required: true },
  phone: { type: String, required: true },
  
  type: { type: String, enum: ["Basic", "ICU", "Air"], default: "Basic" },
  
  isAvailable: { type: Boolean, default: true },
  availabilityStreak: { type: Number, default: 100 }, // for "Streaks" feature
  
  rating: { type: Number, default: 5.0 },
  
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" } // [lng, lat]
  },
  
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Ambulance", ambulanceSchema);
