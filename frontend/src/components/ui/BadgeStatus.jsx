import { motion } from "framer-motion";

const BadgeStatus = ({ status = "INVALID" }) => {
  const isValid = status === "VALID";
  const classes = isValid
    ? "bg-success-500 text-white shadow-success-500/30"
    : "bg-danger-500 text-white shadow-danger-500/30";

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow ${classes}`}
    >
      {status}
    </motion.span>
  );
};

export default BadgeStatus;
