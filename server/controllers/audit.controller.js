import AuditLog from "../models/AuditLog.js";
import crypto from "crypto";

export const verifyBlockchain = async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: 1 });
        let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
        let isValid = true;
        let tamperedLog = null;

        for (let log of logs) {
            const content = JSON.stringify(log.details) + prevHash + log.action + log.emergencyId;
            const rehash = crypto.createHash("sha256").update(content).digest("hex");
            
            if (log.hash !== rehash) {
                isValid = false;
                tamperedLog = log._id;
                break;
            }
            prevHash = log.hash;
        }

        res.json({ 
            isValid, 
            totalBlocks: logs.length,
            tamperedLogId: tamperedLog 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
