import { motion } from "framer-motion";
import { Navigation, Star, Bed } from "lucide-react";

const HospitalList = ({ hospitals, onNavigate }) => {
  return (
    <div className="w-full overflow-x-auto pb-6 pt-2 px-2 flex gap-4 no-scrollbar scroll-smooth">
      {hospitals.map((h, i) => (
        <motion.div
          key={h._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="min-w-[300px] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] p-5 border border-slate-100/50 dark:border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer group"
          onClick={() => onNavigate(h)}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-1">
              <h3 className="font-black text-base leading-tight group-hover:text-blue-500 transition-colors uppercase tracking-tight">{h.name}</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{h.address}</p>
            </div>

            <span className="flex items-center gap-1 text-[10px] font-black bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-900/50 shadow-sm">
              <Star size={10} className="fill-current" /> {h.rating}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {h.specialties?.slice(0, 3).map((s) => (
              <span key={s} className="text-[9px] font-black bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg uppercase tracking-wide">
                {s}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700/50 pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Bed size={14} className="text-blue-600 dark:text-blue-400" />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-xs font-black dark:text-white">{h.bedsAvailable}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Beds Avail</span>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-blue-500/20">
              Vector {h.distance} km
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HospitalList;
