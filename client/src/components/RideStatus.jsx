import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Phone, Star } from "lucide-react";

const RideStatus = ({ ambulance, onCancel }) => {
    const [status, setStatus] = useState("Confirming...");
    const [progress, setProgress] = useState(10);

    useEffect(() => {
        const sequence = [
            { t: 1000, s: "Driver Found!", p: 30 },
            { t: 3000, s: "On the way", p: 60 },
            { t: 8000, s: "Arriving soon", p: 90 },
        ];

        let timeouts = [];
        sequence.forEach(({ t, s, p }) => {
            timeouts.push(setTimeout(() => {
                setStatus(s);
                setProgress(p);
            }, t));
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    if (!ambulance) return null;

    return (
        <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1100] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl text-slate-900 dark:text-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] p-6 w-[calc(100%-32px)] max-w-sm border border-white/20 dark:border-slate-800 transition-colors"
        >
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none dark:text-white">{status}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1 animate-pulse">~4 mins to arrival</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-black px-3 py-1.5 rounded-xl text-[10px] tracking-widest border border-blue-100 dark:border-blue-900/50">
                    {ambulance.plateNumber}
                </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full mb-8 p-1 overflow-hidden">
                <motion.div
                    className="bg-gradient-to-r from-blue-500 to-blue-700 h-full rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", damping: 15 }}
                />
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl mb-6 border border-slate-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center border border-white dark:border-slate-600 shadow-inner">
                    <Star size={24} className="text-slate-400 dark:text-slate-500 fill-slate-300 dark:fill-slate-600" />
                </div>

                <div className="flex-1">
                    <h3 className="font-black text-sm uppercase tracking-tight dark:text-white">{ambulance.driverName}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                        <Star size={12} className="fill-yellow-500 text-yellow-500" />
                        {ambulance.rating}
                        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                        {ambulance.type}
                    </div>
                </div>

                <a href={`tel:${ambulance.phone}`} className="bg-green-500 text-white p-4 rounded-[20px] shadow-lg shadow-green-500/20 hover:scale-110 active:scale-95 transition-all">
                    <Phone size={20} fill="currentColor" />
                </a>
            </div>

            <button
                onClick={onCancel}
                className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors"
            >
                Cancel Incident Request
            </button>
        </motion.div>
    );
};

export default RideStatus;
