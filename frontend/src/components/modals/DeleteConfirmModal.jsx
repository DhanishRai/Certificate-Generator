import { AnimatePresence, motion } from "framer-motion";
import AnimatedButton from "../ui/AnimatedButton";

const DeleteConfirmModal = ({ open, loading = false, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete Certificate</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete this certificate?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <AnimatedButton
                type="button"
                onClick={onClose}
                disabled={loading}
                className="border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="bg-danger-600 text-white hover:bg-danger-500"
              >
                {loading ? "Deleting..." : "Delete"}
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
