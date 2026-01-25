import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet.heat";
import "leaflet-routing-machine";
import { useEffect, useRef } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const UserIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AmbulanceIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const HospitalIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RoutingMachine = ({ userPos, destination }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!userPos || !destination) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userPos.lat, userPos.lng),
        L.latLng(destination.lat, destination.lng)
      ],
      lineOptions: {
        styles: [{ color: "#3B82F6", weight: 6, opacity: 0.8 }]
      },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false
    }).addTo(map);

    routingControlRef.current = routingControl;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, userPos, destination]);

  return null;
};

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    const heat = L.heatLayer(points, { radius: 25, blur: 15, max: 1.0 }).addTo(map);
    return () => { if (heat) map.removeLayer(heat); };
  }, [map, points]);

  return null;
};

const AmbulanceMarker = ({ amb }) => (
  <Marker position={[amb.location.coordinates[1], amb.location.coordinates[0]]} icon={AmbulanceIcon}>
    <Popup>
      <div className="p-2">
        <h3 className="font-bold">{amb.name}</h3>
        <p className="text-xs text-gray-500">Driver: {amb.driverName}</p>

        <div className="mt-2 flex items-center gap-1">
          <div className={`w-3 h-3 rounded-full ${amb.availabilityStreak > 80 ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-tight">{amb.availabilityStreak}% Available</span>
        </div>
      </div>
    </Popup>
  </Marker>
);

const MapRecenter = ({ userPos }) => {
  const map = useMap();

  useEffect(() => {
    if (userPos) {
      map.flyTo([userPos.lat, userPos.lng], 14, { duration: 1.5 });
    }
  }, [userPos, map]);

  return null;
};

const Map = ({ userPos, ambulances = [], hospitals = [], destination, showTraffic, trafficData = [] }) => {
  return (
    <div className="h-full w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 dark:border-gray-800/50 relative z-0">
      <MapContainer
        center={userPos ? [userPos.lat, userPos.lng] : [20, 78]}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url={showTraffic
            ? "https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        {showTraffic && <HeatmapLayer points={trafficData} />}

        {userPos && (
          <>
            <Marker position={[userPos.lat, userPos.lng]} icon={UserIcon}>
              <Popup>You are here</Popup>
            </Marker>
            <Circle center={[userPos.lat, userPos.lng]} radius={300} pathOptions={{ color: 'red', weight: 1, fillOpacity: 0.05 }} />
            <MapRecenter userPos={userPos} />
          </>
        )}

        {ambulances.map((amb) => (
          <AmbulanceMarker key={amb._id} amb={amb} />
        ))}

        {hospitals.map((hosp) => (
          <Marker
            key={hosp._id}
            position={[hosp.location.coordinates[1], hosp.location.coordinates[0]]}
            icon={HospitalIcon}
          >
            <Popup>
              <b className="font-black uppercase tracking-tighter">{hosp.name}</b>
              <br />
              <span className="text-[10px] uppercase font-bold text-slate-400">Tactical Facility</span>
            </Popup>
          </Marker>
        ))}

        {userPos && destination && (
          <RoutingMachine userPos={userPos} destination={destination} />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
