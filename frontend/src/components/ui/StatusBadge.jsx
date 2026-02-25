import { motion } from "framer-motion";

const StatusBadge = ({ status = "INVALID" }) => {
  const isValid = status === "VALID";
  const styleClass = isValid
    ? "bg-success-500/15 text-success-600 ring-success-500/30 dark:text-success-500"
    : "bg-danger-500/15 text-danger-600 ring-danger-500/30 dark:text-danger-500";

  return (
    <motion.span
      initial={{ scale: 0.84, opacity: 0 }}
      animate={{ scale: [0.96, 1.03, 1], opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styleClass}`}
    >
      {status}
    </motion.span>
  );
};

export default StatusBadge;
