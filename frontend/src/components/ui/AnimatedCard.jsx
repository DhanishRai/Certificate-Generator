import { motion } from "framer-motion";

const AnimatedCard = ({ children, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className={`rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
