import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // "SOS_CREATED", "DRIVER_ASSIGNED", "TRIP_COMPLETED"
  emergencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Emergency" },
  details: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  
  // integrity check
  hash: String
});

export default mongoose.model("AuditLog", auditLogSchema);
