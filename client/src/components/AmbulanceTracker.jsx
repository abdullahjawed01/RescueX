import { useEffect, useState } from "react";
import API from "../services/api.js";
import { socket } from "../services/socket.js";

const AmbulanceTracker = ({ userPos }) => {
  const [ambulances, setAmbulances] = useState([]);

  // Listen to live ambulance locations
  useEffect(() => {
    socket.on("driverLocation", (driver) => {
      setAmbulances((prev) => {
        const exist = prev.find((a) => a.id === driver.driverId);
        if (exist) {
          return prev.map((a) =>
            a.id === driver.driverId ? { ...a, lat: driver.lat, lng: driver.lng, isAvailable: driver.isAvailable } : a
          );
        } else {
          return [...prev, driver];
        }
      });
    });
    return () => socket.off("driverLocation");
  }, []);

  // Fetch nearby ambulances from backend
  useEffect(() => {
    if (!userPos) return;

    const fetchNearby = async () => {
      try {
        const res = await API.post("/ambulance/nearby", userPos);
        setAmbulances(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNearby();
  }, [userPos]);

  if (!ambulances.length) return <p className="text-center">No ambulances nearby</p>;

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto p-2">
      {ambulances.map((a) => (
        <div key={a.id} className="bg-white shadow p-3 rounded-lg flex justify-between items-center">
          <div>
            <h3 className="font-bold">{a.name || a.id}</h3>
            <p className="text-sm text-gray-500">
              {a.isAvailable ? "Available ✅" : "Busy ❌"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${a.isAvailable ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            <p className="text-sm">{a.distance?.toFixed(1)} km</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AmbulanceTracker;


