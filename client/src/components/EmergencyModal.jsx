import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Siren, Shield, Heart, Flame, X, MapPin, Check, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ServiceSelection = ({ onSelect }) => {
    const { t } = useLanguage();

    const options = [
        { id: "ambulance", name: "Ambulance", icon: Siren, color: "bg-red-600", desc: "Medical Crisis" },
        { id: "police", name: "Police", icon: Shield, color: "bg-blue-600", desc: "Security Threat" },
        { id: "girl_support", name: "Safety", icon: Heart, color: "bg-pink-600", desc: "Women Support" },
        { id: "fire", name: "Fire", icon: Flame, color: "bg-orange-600", desc: "Fire Hazard" },
    ];

    return (
        <div className="p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Emergency Protocol</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Select critical service for immediate dispatch</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt)}
                        className={`${opt.color} text-white p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 transition-all group relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <opt.icon size={80} />
                        </div>
                        <opt.icon size={40} className="relative z-10" />
                        <div className="relative z-10 text-center">
                            <span className="block font-black text-lg uppercase tracking-tight">{opt.name}</span>
                            <span className="block text-[8px] font-black uppercase tracking-widest opacity-70">{opt.desc}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const SearchingScreen = ({ onFound }) => {
    const [status, setStatus] = useState("Initializing Dispatch...");

    useEffect(() => {
        const t1 = setTimeout(() => setStatus("Locating Nearest Unit..."), 1500);
        const t2 = setTimeout(() => {
            setStatus("Vector Locked!");
            onFound();
        }, 3000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25" />
                <div className="absolute -inset-4 border-2 border-red-500/20 rounded-full animate-pulse" />
                <div className="bg-red-100 dark:bg-red-900/30 p-10 rounded-full text-red-600 relative z-10">
                    <Siren size={64} className="animate-pulse" />
                </div>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white mb-3">{status}</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Maintain composure. Response team is active.</p>
        </div>
    );
};

const HospitalSelection = ({ hospitals, onSelectHospital }) => {
    const { t } = useLanguage();

    return (
        <div className="p-8 h-[600px] flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Facility Selection</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Choose destination criteria (Distance/Score)</p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
                {hospitals.map(h => (
                    <motion.div
                        key={h._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        onClick={() => onSelectHospital(h)}
                        className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-5 rounded-[28px] hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:border-blue-500/30 cursor-pointer transition-all flex justify-between items-center group"
                    >
                        <div>
                            <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight group-hover:text-blue-500 transition-colors">{h.name}</h3>
                            <div className="flex items-center gap-3 mt-2 text-[10px] font-black text-slate-400 uppercase">
                                <span className="text-blue-500">{h.distance} km</span>
                                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span>{h.bedsAvailable} Beds Avail</span>
                            </div>
                        </div>
                        <button className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:scale-105 transition-all shadow-md">Select</button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const TripConfirmed = ({ service, driver, hospital, onMinimize }) => {
    const ServiceIcon = service?.icon || Check;
    const isMedical = service?.id === 'ambulance';

    return (
        <div className="p-8 text-center">
            <div className={`w-20 h-20 ${service?.color || 'bg-green-600'} text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3`}>
                <ServiceIcon size={40} strokeWidth={3} />
            </div>

            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white mb-2">
                {isMedical ? "Unit Dispatched" : `${service?.name} Support Active`}
            </h2>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                {isMedical ? "Tactical response team is en route" : "Emergency responders have been alerted"}
            </p>

            <div className="space-y-4 mb-8">
                {isMedical && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[28px] text-left border border-slate-100 dark:border-slate-800">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Destination Intel</p>
                        <h3 className="font-black dark:text-slate-200 flex items-center gap-2 uppercase tracking-tight text-sm"><MapPin size={16} className="text-blue-500" /> {hospital?.name || "Emergency Facility"}</h3>
                    </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[28px] text-left border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                            {isMedical ? "Assigned Pilot" : "Primary Responder"}
                        </p>
                        <h3 className="font-black dark:text-slate-200 uppercase tracking-tight text-sm">{driver.driverName}</h3>
                        <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">{driver.plateNumber}</p>
                    </div>
                    <a href={`tel:${driver.phone}`} className={`p-4 rounded-[20px] shadow-lg text-white hover:scale-110 active:scale-95 transition-all ${isMedical ? 'bg-green-500 shadow-green-500/20' : service?.color}`}>
                        <Phone size={20} fill="currentColor" />
                    </a>
                </div>
            </div>

            <button onClick={onMinimize} className="w-full bg-slate-900 dark:bg-white text-white dark:text-gray-900 py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:brightness-110 active:scale-95 transition-all">Track Live Operations</button>
        </div>
    );
};

const EmergencyModal = ({ isOpen, onClose, hospitals, onStartTrip }) => {
    const [step, setStep] = useState(1);
    const [service, setService] = useState(null);
    const [selectedHospital, setSelectedHospital] = useState(null);

    const getResponderData = (serviceId) => {
        const base = { phone: "+1 555-0123", rating: 4.9, location: { coordinates: [0, 0] } };
        switch (serviceId) {
            case 'police': return { ...base, driverName: "Officer J. West", plateNumber: "LSPD-402", type: "Interceptor" };
            case 'fire': return { ...base, driverName: "Marshal R. Blaze", plateNumber: "FIRE-TRK-7", type: "Rapid Response" };
            case 'girl_support': return { ...base, driverName: "Counselor Sarah", plateNumber: "SAFE-UNIT-1", type: "Protection" };
            default: return { ...base, driverName: "Michael Knight", plateNumber: "RX-9999", type: "ICU" };
        }
    };

    if (!isOpen) return null;

    const mockDriver = getResponderData(service?.id);

    return (
        <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[48px] shadow-[0_50px_150px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all border border-white/20 dark:border-slate-800"
            >
                <button onClick={onClose} className="absolute top-8 right-8 z-[1410] p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-inner">
                    <X size={20} className="dark:text-white" />
                </button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {step === 1 && <ServiceSelection onSelect={(s) => { setService(s); setStep(2); }} />}

                        {step === 2 && <SearchingScreen onFound={() => {
                            if (service?.id === 'ambulance') {
                                setStep(3);
                            } else {
                                setStep(4);
                            }
                        }} />}

                        {step === 3 && <HospitalSelection hospitals={hospitals} onSelectHospital={(h) => {
                            setSelectedHospital(h);
                            setStep(4);
                        }} />}

                        {step === 4 && <TripConfirmed service={service} driver={mockDriver} hospital={selectedHospital} onMinimize={() => {
                            onStartTrip(mockDriver, selectedHospital);
                            onClose();
                        }} />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default EmergencyModal;
