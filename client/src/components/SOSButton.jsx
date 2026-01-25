import API from "../services/api.js";
import { motion } from "framer-motion";

const SOSButton = ({ location }) => {
  const sendSOS = async () => {
    try {
      await API.post("/ambulance/sos", location);
      alert("🚨 Ambulance Alert Sent! Help is on the way.");
    } catch (error) {
      alert("Failed to send SOS. Please call 911 directly.");
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(220, 38, 38, 0.7)",
          "0 0 0 20px rgba(220, 38, 38, 0)"
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
      onClick={sendSOS}
      className="bg-gradient-to-r from-red-600 to-red-800 text-white w-24 h-24 rounded-full font-bold text-xl shadow-2xl flex items-center justify-center border-4 border-red-400 z-50"
    >
      SOS
    </motion.button>
  );
};

export default SOSButton;
