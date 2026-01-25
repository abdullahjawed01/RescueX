import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  
  specialties: [String],
  bedsAvailable: { type: Number, default: 0 },
  insuranceAccepted: { type: Boolean, default: true },
  rating: { type: Number, default: 4.0 },
  
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" } // [lng, lat]
  }
});

export default mongoose.model("Hospital", hospitalSchema);
