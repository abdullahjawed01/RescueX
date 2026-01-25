import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";

import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(helmet()); 
app.use(cors({ origin: "*" })); 
app.use(express.json());
app.use(morgan("dev"));

import ambulanceRoutes from "./routes/ambulance.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";
import userRoutes from "./routes/user.routes.js";
import seedRoutes from "./routes/seed.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import adminRoutes from "./routes/admin.routes.js";

app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin", adminRoutes);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log(`🔌 Socket Connected: ${socket.id}`);

  socket.on("join_tracking", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined tracking room`);
  });

  socket.on("driver_location", (data) => {
    io.to(data.emergencyId).emit("track_driver", data);
  });

  socket.on("accident_alert", (data) => {
    console.log("💥 Accident Detected:", data);
    io.emit("new_incident", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected");
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server Error", message: err.message });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
