import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedAmbulance: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
  destinationHospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  
  status: { 
    type: String, 
    enum: ["Searching", "Assigned", "PickedUp", "Completed", "Cancelled"], 
    default: "Searching" 
  },
  
  pickupLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  
  type: { type: String, enum: ["Medical", "Police", "Fire", "GirlSupport"], default: "Medical" },
  
  // For Blockchain Audit Log
  previousHash: { type: String },
  hash: { type: String },

  createdAt: { type: Date, default: Date.now }
});

emergencySchema.index({ pickupLocation: "2dsphere" });

export default mongoose.model("Emergency", emergencySchema);
