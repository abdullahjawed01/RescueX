import { useEffect, useState } from "react";
import API from "../services/api.js";
import {
    ShieldAlert, Activity, CheckCircle, Database,
    Siren, Clock, MapPin, TrendingUp, AlertTriangle,
    Navigation, User, Car
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRides: 0,
        activeRides: 0,
        totalAmbulances: 0,
        totalHospitals: 0,
        systemHealth: "Optimal"
    });
    const [activeRides, setActiveRides] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, ridesRes] = await Promise.all([
                    API.get("/admin/stats"),
                    API.get("/admin/active-rides")
                ]);
                setStats(statsRes.data.stats);
                setLogs(statsRes.data.recentLogs);
                setActiveRides(ridesRes.data);
            } catch (err) {
                console.error("Admin API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const StatusCard = ({ icon: Icon, title, value, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-xl flex flex-col gap-2 relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform ${color}`}>
                <Icon size={120} strokeWidth={1} />
            </div>

            <div className={`p-3 rounded-2xl w-fit ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon size={24} className={color} />
            </div>

            <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2">{title}</h3>
            <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">{value}</p>
        </motion.div>
    );

    return (
        <div className="p-6 md:p-10 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-white transition-colors duration-500">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                        <ShieldAlert className="text-red-600 animate-pulse" size={40} /> COMMAND CENTER
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1 ml-11">Orbital Monitoring Active • 10 Minutes Rescue</p>
                </div>

                <div className="flex gap-2">
                    <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">Systems Prime</span>
                    </div>
                    <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">Audit Ledger</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatusCard icon={Activity} title="Fleet Utilization" value={`${stats.activeRides}/${stats.totalAmbulances}`} color="text-blue-500" delay={0.1} />
                <StatusCard icon={Siren} title="Active Incidents" value={stats.activeRides} color="text-red-500" delay={0.2} />
                <StatusCard icon={TrendingUp} title="System Throughput" value={`${stats.totalRides} OPS`} color="text-green-500" delay={0.3} />
                <StatusCard icon={CheckCircle} title="Protocol Integrity" value={stats.systemHealth} color="text-purple-500" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Navigation size={20} className="text-red-500" /> Active Operations
                        </h2>
                        <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase text-slate-400">Real-time Vectoring</span>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {activeRides.length > 0 ? (
                                activeRides.map((ride, idx) => (
                                    <motion.div
                                        key={ride._id}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-6 rounded-[32px] shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600">
                                                    <Siren size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">{ride.type} Emergency</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                        <Clock size={10} /> Active for {Math.floor((Date.now() - new Date(ride.createdAt)) / 60000)} mins
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                                        <User size={14} className="text-blue-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase text-slate-400">Subject</span>
                                                        <span className="text-xs font-bold">{ride.user?.name || "Anonymous"}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                                        <Car size={14} className="text-yellow-500" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase text-slate-400">Unit</span>
                                                        <span className="text-xs font-bold">{ride.assignedAmbulance?.name || "Pending..."}</span>
                                                    </div>
                                                </div>

                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ride.status === 'Searching' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                    {ride.status}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-40 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/5 flex items-center justify-center">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Active Emergency Signals Detected</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <Database size={20} className="text-purple-500" /> Integrity Ledger
                    </h2>

                    <div className="bg-slate-900 border border-white/5 rounded-[40px] p-6 shadow-3xl">
                        <div className="space-y-6">
                            {logs.map((log, idx) => (
                                <div key={log._id} className="relative pl-6 border-l-2 border-slate-800">
                                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#A855F7]" />
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                    <h5 className="text-xs font-black text-slate-300 uppercase tracking-tight mt-1">{log.action}</h5>
                                    <p className="text-[10px] text-slate-500 mt-1 truncate font-mono">{log.details}</p>
                                    <div className="mt-2 text-[8px] font-mono text-purple-400/50 truncate">BLOCK_HASH: {log.hash?.substring(0, 32)}...</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Load Master Archives</button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden relative group">
                        <div className="absolute -top-10 -right-10 p-20 bg-blue-500/10 rounded-full blur-3xl" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-500" /> Hotspot Analysis
                        </h3>

                        <div className="space-y-4 relative z-10">
                            {[
                                { area: "Downtown Core", traffic: 88, status: "Critical" },
                                { area: "Westside Hub", traffic: 42, status: "Fluid" },
                                { area: "South Interchange", traffic: 65, status: "Moderate" }
                            ].map((zone) => (
                                <div key={zone.area}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{zone.area}</span>
                                        <span className={`text-[8px] font-black uppercase ${zone.status === 'Critical' ? 'text-red-500' : 'text-blue-500'}`}>{zone.status}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${zone.traffic}%` }}
                                            className={`h-full ${zone.status === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;
