import { AnimatePresence, motion } from "framer-motion";

const Toast = ({ open, message, type = "success" }) => {
  const classes =
    type === "success"
      ? "border-success-500/30 bg-success-500/15 text-success-700 dark:text-success-500"
      : "border-danger-500/30 bg-danger-500/15 text-danger-700 dark:text-danger-500";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          className={`fixed right-4 top-24 z-[70] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${classes}`}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Toast;
