import { io } from "socket.io-client";

// Connect to backend socket server
const socket = io("http://localhost:5000");

// When connected
socket.on("connect", () => {
  console.log("✅ Connected as Ambulance:", socket.id);

  // Send fake location every 5 sec
  setInterval(() => {
    const location = {
      driverId: "AMB-001",
      lat: 28.61 + Math.random() * 0.01,
      lng: 77.23 + Math.random() * 0.01
    };

    socket.emit("driverLocation", location);

    console.log("📍 Sent:", location);

  }, 5000);
});

// Listen SOS
socket.on("newSOS", (data) => {
  console.log("🚨 SOS RECEIVED:", data);
});
