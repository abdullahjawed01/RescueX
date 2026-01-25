import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, AlertCircle, Pill } from "lucide-react";

const MedicalID = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-900 border border-white/20 dark:border-slate-800 text-slate-900 dark:text-slate-100 w-full max-w-md rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden relative"
            >
                <div className="bg-gradient-to-br from-red-500 to-red-700 p-8 text-white relative">
                    <div className="absolute top-6 right-6 flex gap-2">
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><X size={20} /></button>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-3xl font-black border border-white/30">
                            {user.medicalID?.bloodGroup || "??"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{user.name}</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-1">Certified Medical ID</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-3xl border border-red-100/50 dark:border-red-900/30">
                            <h4 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                                <AlertCircle size={14} /> Allergies
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {user.medicalID?.allergies?.length > 0 ? (
                                    user.medicalID.allergies.map((a, i) => (
                                        <span key={i} className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg text-[10px] font-black uppercase border border-slate-100 dark:border-slate-700 shadow-sm">{a}</span>
                                    ))
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-400 italic">No Data</span>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-3xl border border-blue-100/50 dark:border-blue-900/30">
                            <h4 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                                <Pill size={14} /> Meds
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {user.medicalID?.medications?.length > 0 ? (
                                    user.medicalID.medications.map((m, i) => (
                                        <span key={i} className="bg-white dark:bg-slate-800 px-2 py-1 rounded-lg text-[10px] font-black uppercase border border-slate-100 dark:border-slate-700 shadow-sm">{m}</span>
                                    ))
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-400 italic">None</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-4">Emergency Contacts</h4>
                        <div className="space-y-3">
                            {user.emergencyContacts?.map((c, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 transition-hover hover:border-green-500/50">
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-tight">{c.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{c.relation}</p>
                                    </div>
                                    <a href={`tel:${c.phone}`} className="bg-green-500 text-white p-3 rounded-2xl shadow-lg shadow-green-500/20 hover:scale-110 active:scale-95 transition-all">
                                        <Heart size={16} fill="currentColor" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MedicalID;
