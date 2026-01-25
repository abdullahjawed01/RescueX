import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Guest" },
  phone: { type: String }, // Optional for Quick SOS
  medicalID: {
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"], default: "Unknown" },
    allergies: [String],
    conditions: [String],
    medications: [String]
  },
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String,
    notifyViaWhatsapp: { type: Boolean, default: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
