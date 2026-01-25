import { useEffect, useState } from "react";
import API from "../services/api.js";
import Map from "../components/Map.jsx";
import MedicalID from "../components/MedicalID.jsx";
import FirstAidHelper from "../components/FirstAidHelper.jsx";
import QuickDial from "../components/QuickDial.jsx";
import RideStatus from "../components/RideStatus.jsx";
import HospitalList from "../components/HospitalList.jsx";
import EmergencyModal from "../components/EmergencyModal.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, User, MapPinned, Share2, Siren, Star, MapPin, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import useVoiceSOS from "../hooks/useVoiceSOS";
import useAccidentDetection from "../hooks/useAccidentDetection";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const { t, lang, changeLanguage } = useLanguage();
  const { theme } = useTheme();

  const [userPos, setUserPos] = useState(null);
  const [user, setUser] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [showMedicalID, setShowMedicalID] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [showTraffic, setShowTraffic] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTrayOpen, setIsTrayOpen] = useState(true);

  useVoiceSOS(() => setShowEmergencyModal(true));

  useAccidentDetection((data) => {
    alert("🚨 Potential Accident Detected! Sending SOS...");
    setShowEmergencyModal(true);
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(coords);

        try {
          await API.post("/seed/run", coords);
          const [hospRes, ambRes, userRes] = await Promise.all([
            API.post("/hospital/nearby", coords),
            API.post("/ambulance/nearby", coords),
            API.get("/user/profile")
          ]);

          setHospitals(hospRes.data);
          setAmbulances(ambRes.data);
          setUser(userRes.data);
        } catch (err) {
          console.error("API Error:", err);
          alert(`Service Error: ${err.response?.data?.message || "Failed to connect to services."}`);
        } finally {
          setLoading(false);
        }
      },
      () => alert("Location access required")
    );
  }, []);

  const handleBookRide = (ambulance) => setActiveRide(ambulance);
  const handleEmergencyStart = (driver, hospital) => setActiveRide(driver);

  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'RescueX',
        text: `Emergency! My location: ${userPos.lat}, ${userPos.lng}`,
        url: window.location.href
      });
    } else {
      alert("Location copied!");
    }
  };

  const filteredAmbulances = filterType === "All"
    ? ambulances
    : ambulances.filter(a => a.type === filterType);

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden transition-colors duration-500">

      <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-[1100] shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-600 dark:text-slate-400"
            aria-label="Toggle Navigation"
          >
            <Menu size={20} />
          </button>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-red-600 dark:text-red-500 uppercase">RescueX</span>
            <div className="h-4 w-[2px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest hidden sm:block">10 Minutes Rescue</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMedicalID(true)}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-black transition hover:scale-105 active:scale-95"
          >
            <User size={16} />
            <span className="hidden md:inline">{t('medicalId')}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <ThemeToggle />
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 px-2 cursor-pointer outline-none"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="hi">HI</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-80 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-[1050] shadow-2xl"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">{t('activeUnits')}</h2>
                  <div className="flex gap-1">
                    {["ICU", "Basic", "Air"].map(typ => (
                      <div key={typ} className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" title={typ} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                  {["All", "ICU", "Basic", "Air"].map(type => (
                    <button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filterType === type ? 'bg-slate-900 dark:bg-white text-white dark:text-gray-900 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'}`}>{type}</button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                  {filteredAmbulances.map(a => (
                    <motion.div
                      key={a._id}
                      whileHover={{ x: 5 }}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 group cursor-pointer transition-colors"
                      onClick={() => handleBookRide(a)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-black text-slate-800 dark:text-slate-200 text-sm">{a.name}</h3>
                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">{a.driverName}</p>
                        </div>
                        <span className="text-[10px] font-black bg-white dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-600 dark:text-slate-300">{a.type}</span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                          <Star size={10} className="text-yellow-500 fill-yellow-500" />
                          {a.rating}
                          <div className="w-1 h-1 bg-slate-300 rounded-full" />
                          {a.distance} km
                        </div>
                        <button className="bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Book</button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <QuickDial />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1 relative flex flex-col overflow-hidden">

          <div className="absolute inset-0 z-0">
            <Map
              userPos={userPos}
              ambulances={filteredAmbulances}
              hospitals={hospitals}
              destination={activeRide?.location ? { lat: activeRide.location.coordinates[1], lng: activeRide.location.coordinates[0] } : null}
              showTraffic={showTraffic}
            />
          </div>

          <div className="absolute top-4 left-4 z-[900] flex gap-2">
            <button onClick={() => setShowTraffic(!showTraffic)} className={`p-3 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 transition-all ${showTraffic ? 'bg-blue-600 text-white scale-110' : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400'}`} title="Traffic Layer">
              <MapPinned size={20} />
            </button>

            <button onClick={shareLocation} className="p-3 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-white/20 hover:text-blue-500 transition-colors" title="Export Context">
              <Share2 size={20} />
            </button>
          </div>

          {userPos && !activeRide && (
            <div className="absolute top-4 right-4 z-[900]">
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="group flex flex-col items-center gap-1"
                aria-label="Direct SOS Action"
              >
                <div className="relative w-16 h-16 bg-red-600 text-white rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.5)] flex items-center justify-center font-black animate-pulse group-hover:scale-110 group-active:scale-90 transition-all">
                  SOS
                  <div className="absolute -inset-1 border-2 border-red-600/50 rounded-2xl animate-ping" />
                </div>
                <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-xl mt-1">Emergency</span>
              </button>
            </div>
          )}

          <div className={`absolute bottom-0 left-0 right-0 z-[1000] px-4 pb-6 transition-all duration-700 ease-in-out ${isTrayOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'}`}>
            <div className="max-w-6xl mx-auto flex flex-col gap-2">
              <div className="flex justify-center">
                <button
                  onClick={() => setIsTrayOpen(!isTrayOpen)}
                  className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl px-8 py-3 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 text-slate-400 hover:text-blue-500 transition-colors flex flex-col items-center gap-1 group"
                >
                  <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full group-hover:bg-blue-500 transition-colors" />
                  {!isTrayOpen && <span className="text-[10px] font-black uppercase tracking-tighter text-blue-500 animate-pulse">{t('nearbyHospitals')}</span>}
                </button>
              </div>

              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white/20 dark:border-slate-800/50 p-2">
                <HospitalList hospitals={hospitals} onNavigate={(h) => console.log('Vectoring to', h.name)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMedicalID && <MedicalID user={user} onClose={() => setShowMedicalID(false)} />}
        {activeRide && <RideStatus ambulance={activeRide} onCancel={() => setActiveRide(null)} />}
        {showEmergencyModal && (
          <EmergencyModal
            isOpen={showEmergencyModal}
            onClose={() => setShowEmergencyModal(false)}
            hospitals={hospitals}
            onStartTrip={handleEmergencyStart}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-32 right-6 z-[1100]">
        <FirstAidHelper />
      </div>

    </div>
  );
};

export default Home;
