import Emergency from "../models/Emergency.js";
import Ambulance from "../models/Ambulance.js";
import AuditLog from "../models/AuditLog.js";
import Hospital from "../models/Hospital.js";

export const getAdminStats = async (req, res) => {
    try {
        const [totalRides, activeRides, totalAmbulances, totalHospitals, recentLogs] = await Promise.all([
            Emergency.countDocuments(),
            Emergency.countDocuments({ status: { $in: ["Searching", "Assigned", "PickedUp"] } }),
            Ambulance.countDocuments(),
            Hospital.countDocuments(),
            AuditLog.find().sort({ createdAt: -1 }).limit(10)
        ]);

        res.json({
            stats: {
                totalRides,
                activeRides,
                totalAmbulances,
                totalHospitals,
                systemHealth: "Optimal"
            },
            recentLogs
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getActiveRides = async (req, res) => {
    try {
        const activeRides = await Emergency.find({ 
            status: { $in: ["Searching", "Assigned", "PickedUp"] } 
        })
        .populate("assignedAmbulance")
        .populate("destinationHospital")
        .populate("user")
        .sort({ createdAt: -1 });

        res.json(activeRides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getTrafficDensity = async (req, res) => {
    try {
        const emergencies = await Emergency.find().limit(50);
        
        const points = emergencies.map(e => [
            e.pickupLocation.coordinates[1], 
            e.pickupLocation.coordinates[0], 
            0.8 
        ]);

        res.json(points);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
