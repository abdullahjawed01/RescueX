import axios from "axios";

/**
 * Find nearby hospitals using Overpass API
 */
export const findHospitals = async (lat, lng) => {
  const query = `
  [out:json][timeout:25];
  (
    node["amenity"="hospital"](around:3000,${lat},${lng});
    way["amenity"="hospital"](around:3000,${lat},${lng});
    relation["amenity"="hospital"](around:3000,${lat},${lng});
  );
  out center;
  `;

  try {
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      {
        headers: {
          "Content-Type": "text/plain"
        },
        timeout: 30000
      }
    );

    return response.data.elements || [];

  } catch (error) {
    console.error("❌ Overpass Error:", error.message);
    throw error;
  }
};
