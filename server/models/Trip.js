import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userLocation: Object,
  ambulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ambulance"
  },
  status: {
    type: String,
    default: "pending"
  },
  startedAt: Date,
  endedAt: Date
});

export default mongoose.model("Trip", tripSchema);
