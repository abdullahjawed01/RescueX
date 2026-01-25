import express from "express";
import cors from "cors";
import morgan from "morgan";

import ambulanceRoutes from "./routes/ambulance.routes.js";
import sosRoutes from "./routes/sos.routes.js";
import routeRoutes from "./routes/route.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import seedRoutes from "./routes/seed.routes.js";

import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/seed-nearby", seedRoutes);
app.use("/api/user", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🚑 Ambulance Server Running" });
});

export default app;
