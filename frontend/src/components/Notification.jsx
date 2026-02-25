import { motion } from "framer-motion";

const Notification = ({ type = "success", message }) => {
  if (!message) return null;

  const styles =
    type === "error"
      ? "bg-danger-500/10 border-danger-500/30 text-danger-600 dark:text-danger-500"
      : "bg-success-500/10 border-success-500/30 text-success-600 dark:text-success-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      {message}
    </motion.div>
  );
};

export default Notification;
