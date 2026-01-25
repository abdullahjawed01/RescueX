import Ambulance from "../models/Ambulance.js";
import Trip from "../models/Trip.js";

export const sendSOS = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const ambulances = await Ambulance.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          }
        }
      },
      isAvailable: true
    }).limit(3);

    if (!ambulances.length)
      return res.status(404).json({ message: "No ambulance found" });

    const trip = await Trip.create({
      userLocation: { lat, lng },
      ambulance: ambulances[0]._id,
      startedAt: new Date()
    });

    res.json({
      message: "🚨 SOS Sent",
      trip,
      assigned: ambulances[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
