import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    // For demo, return a default guest user
    let user = await User.findOne({ name: "Abdullah Jawed" });
    
    if (!user) {
      user = await User.create({
        name: "Abdullah Jawed",
        phone: "+1 555-0321",
        medicalID: {
          bloodGroup: "O+",
          allergies: ["Peanuts"],
          conditions: [],
          medications: []
        },
        emergencyContacts: [
          { name: "Emergency Contact", phone: "+1 555-9999", relation: "Family", notifyViaWhatsapp: true }
        ]
      });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
