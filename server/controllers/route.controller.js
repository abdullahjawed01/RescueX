import { getRoute } from "../services/osrm.service.js";

export const optimizeRoute = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const route = await getRoute(from, to);

    res.json({
      distance: (route.distance / 1000).toFixed(2),
      duration: (route.duration / 60).toFixed(1),
      geometry: route.geometry
    });

  } catch (err) {
    console.error("Route Error:", err.message);

    res.status(500).json({
      error: "Routing failed",
      details: err.message
    });
  }
};
