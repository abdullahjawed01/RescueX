import crypto from "crypto";
import Emergency from "../models/Emergency.js";
import AuditLog from "../models/AuditLog.js";
import Ambulance from "../models/Ambulance.js";
import User from "../models/User.js";

// 20. Blockchain Hash Linkage
const logAction = async (action, emergencyId, details) => {
  const lastLog = await AuditLog.findOne().sort({ timestamp: -1 });
  const prevHash = lastLog ? lastLog.hash : "0000000000000000000000000000000000000000000000000000000000000000";
  
  const content = JSON.stringify(details) + prevHash + action + emergencyId;
  const hash = crypto.createHash("sha256").update(content).digest("hex");

  await AuditLog.create({ action, emergencyId, details, hash });
};

// 6. WhatsApp Alert Helper (Simulated)
const sendWhatsappAlert = async (user, location) => {
    console.log(`📱 Sending WhatsApp Alert to ${user.emergencyContacts.length} contacts...`);
    // Mocking twilio call
    user.emergencyContacts.forEach(contact => {
        console.log(`[WA] To: ${contact.phone} | MSG: RescueX ALERT! ${user.name} is in an emergency at ${location.coordinates[1]}, ${location.coordinates[0]}.`);
    });
};

// 1. Create SOS
export const createSOS = async (req, res) => {
  try {
    const { lat, lng, type, userId } = req.body;
    
    let user = await User.findById(userId) || await User.findOne({ name: "Guest" }); 
    if (!user) user = await User.create({ name: "Guest", phone: "911" });

    const emergency = await Emergency.create({
      user: user._id,
      pickupLocation: { type: "Point", coordinates: [lng, lat] },
      type: type || "Medical",
      status: "Searching"
    });

    await logAction("SOS_CREATED", emergency._id, { lat, lng, type });
    
    // Trigger WhatsApp Alert if contacts exist
    if (user.emergencyContacts.length > 0) {
        await sendWhatsappAlert(user, emergency.pickupLocation);
    }

    res.json(emergency);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Assign Driver (Simulation)
export const assignDriver = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    
    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) return res.status(404).json({ error: "Emergency not found" });

    const [lng, lat] = emergency.pickupLocation.coordinates;

    const ambulance = await Ambulance.findOne({
      isAvailable: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 20000 
        }
      }
    });

    if (ambulance) {
      emergency.assignedAmbulance = ambulance._id;
      emergency.status = "Assigned";
      await emergency.save();
      
      ambulance.isAvailable = false;
      await ambulance.save();

      await logAction("DRIVER_ASSIGNED", emergency._id, { ambulanceId: ambulance._id });
      
      res.json({ success: true, ambulance });
    } else {
      res.status(404).json({ error: "No ambulances nearby" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
