import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, ChevronRight } from "lucide-react";

const guides = [
    {
        title: "CPR (Adult)",
        steps: ["Push hard & fast in center of chest", "100-120 compressions/min", "Check airway"]
    },
    {
        title: "Choking",
        steps: ["5 back blows", "5 abdominal thrusts", "Repeat until cleared"]
    },
    {
        title: "Severe Bleeding",
        steps: ["Apply direct pressure", "Elevate limb", "Use tourniquet if needed"]
    },
    {
        title: "Burns",
        steps: ["Cool with water (10m)", "Cover with clean cloth", "Do NOT use ice"]
    }
];

const FirstAidHelper = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 p-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl text-slate-700 dark:text-slate-200 group"
                aria-label="Open First Aid Intelligence"
            >
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl group-hover:bg-yellow-100 transition-colors">
                    <BookOpen size={20} className="text-yellow-600 dark:text-yellow-500" />
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest hidden md:block">Intelligence</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-lg rounded-[40px] border border-white/20 dark:border-slate-800 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.4)]"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-black text-xl tracking-tight uppercase">First Aid Protocols</h3>
                                <button onClick={() => { setIsOpen(false); setSelectedGuide(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"><X size={20} /></button>
                            </div>

                            <div className="p-6 h-[500px] overflow-y-auto no-scrollbar">
                                {selectedGuide ? (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <button onClick={() => setSelectedGuide(null)} className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2 hover:gap-3 transition-all">← Back to Menu</button>
                                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tighter">{selectedGuide.title}</h2>

                                        <div className="space-y-4">
                                            {selectedGuide.steps.map((step, i) => (
                                                <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                                    <span className="bg-slate-900 dark:bg-blue-600 w-10 h-10 flex items-center justify-center rounded-2xl flex-shrink-0 text-white font-black">{i + 1}</span>
                                                    <p className="text-base font-bold leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="grid gap-4">
                                        {guides.map((g) => (
                                            <button
                                                key={g.title}
                                                onClick={() => setSelectedGuide(g)}
                                                className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[28px] flex justify-between items-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:border-blue-500/30 border border-transparent transition-all group"
                                            >
                                                <span className="font-black uppercase tracking-tight text-slate-700 dark:text-slate-300 group-hover:text-blue-500">{g.title}</span>
                                                <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                                                    <ChevronRight className="text-slate-400" size={16} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FirstAidHelper;
