import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedButton from "../ui/AnimatedButton";
import Spinner from "../Spinner";

const EmailModal = ({ open, certificate, loading = false, onClose, onSend }) => {
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    if (open) {
      setRecipientEmail("");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!certificate?._id || !recipientEmail.trim()) return;
    await onSend({
      certificateId: certificate._id,
      recipientEmail: recipientEmail.trim(),
    });
  };

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
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Send Certificate via Email</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Certificate for <span className="font-medium">{certificate?.name}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Recipient Gmail
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@gmail.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3">
                <AnimatedButton
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
                >
                  {loading ? <Spinner small /> : null}
                  {loading ? "Sending..." : "Send Email"}
                </AnimatedButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default EmailModal;
