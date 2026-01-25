import axios from "axios";

const BASE = "https://router.project-osrm.org";

export const getRoute = async (from, to) => {
  try {
    const url = `${BASE}/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;

    const res = await axios.get(url, { timeout: 10000 });

    if (!res.data.routes.length) {
      throw new Error("No route found");
    }

    return res.data.routes[0];

  } catch (err) {
    console.error("OSRM Error:", err.message);
    throw err;
  }
};
