import Ambulance from "../models/Ambulance.js";

export const findNearbyAmbulance = async (req, res) => {
  try {
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid or missing coordinates" });
    }

    console.log(`🚑 Searching ambulances near: [${lng}, ${lat}]`);

    const ambulances = await Ambulance.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          spherical: true,
          query: { isAvailable: true },
          maxDistance: 15000 // 15 km
        }
      },
      { $limit: 10 }
    ]);

    console.log(`✅ Found ${ambulances.length} ambulances`);

    const ambWithDistance = ambulances.map(a => ({
      ...a,
      distance: a.distance ? +(a.distance / 1000).toFixed(2) : 0
    }));

    res.json(ambWithDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ambulance fetch failed" });
  }
};
