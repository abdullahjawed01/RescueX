import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", ...props }) => {
    return (
        <motion.div
            className={`bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
