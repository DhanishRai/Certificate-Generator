import { motion } from "framer-motion";
import AnimatedCard from "./AnimatedCard";

const StatCard = ({ label, value, icon, colorClass = "text-primary-600" }) => {
  return (
    <AnimatedCard className="relative overflow-hidden">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 opacity-60 dark:from-primary-600/20 dark:to-secondary-600/20" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <motion.p
            key={value}
            initial={{ opacity: 0.3, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-2 text-3xl font-bold text-slate-900 dark:text-white"
          >
            {value}
          </motion.p>
        </div>
        <div className={`${colorClass}`}>{icon}</div>
      </div>
    </AnimatedCard>
  );
};

export default StatCard;
