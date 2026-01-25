import Hospital from "../models/Hospital.js";

export const findNearbyHospitals = async (req, res) => {
  try {
    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid or missing coordinates" });
    }

    console.log(`🔍 Searching hospitals near: [${lng}, ${lat}]`);

    // Geospatial Retrieval
    const hospitals = await Hospital.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          spherical: true,
          maxDistance: 25000 
        }
      }
    ]);

    console.log(`✅ Found ${hospitals.length} hospitals`);

    // 16. Smart Ranking Algorithm (Weighted Score)
    // Distance (Lower is better), Beds (Higher is better), Rating (Higher is better)
    const rankedHospitals = hospitals.map(h => {
        const distKm = h.distance / 1000;
        const normalizedDist = Math.max(0, 1 - (distKm / 25)); // 0-1 scale
        const normalizedBeds = Math.min(1, h.bedsAvailable / 50); // cap at 50 to normalize
        const normalizedRating = h.rating / 5;

        // Weights: 40% Distance, 30% Beds, 30% Rating
        h.rankScore = (normalizedDist * 0.4) + (normalizedBeds * 0.3) + (normalizedRating * 0.3);
        h.distance = +distKm.toFixed(2);
        return h;
    }).sort((a, b) => b.rankScore - a.rankScore); // Higher score first

    res.json(rankedHospitals.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: "Hospital fetch failed" });
  }
};
