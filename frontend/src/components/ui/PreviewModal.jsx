import { AnimatePresence, motion } from "framer-motion";
import AnimatedButton from "./AnimatedButton";
import TemplateCard from "../templates/TemplateCard";

const PreviewModal = ({ open, template, onClose, onConfirm, loading }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Certificate Generation</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              This preview shows your selected template style before generation.
            </p>

            <div className="mt-4">
              <TemplateCard template={template} selected />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <AnimatedButton
                type="button"
                onClick={onClose}
                className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                disabled={loading}
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                type="button"
                onClick={onConfirm}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
                disabled={loading}
              >
                {loading ? "Generating..." : "Confirm Generate"}
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default PreviewModal;
