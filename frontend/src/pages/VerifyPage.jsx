import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import FloatingBackground from "../components/animations/FloatingBackground";
import Navbar from "../components/layout/Navbar";
import Notification from "../components/Notification";
import Spinner from "../components/Spinner";
import AnimatedButton from "../components/ui/AnimatedButton";
import StatusBadge from "../components/ui/StatusBadge";
import { verifyCertificate } from "../services/certificateService";
import { incrementVerificationCount } from "../services/metrics";

const VerifyPage = () => {
  const { certificateId: routeCertificateId } = useParams();
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState(routeCertificateId || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const checkCertificate = async (id) => {
    if (!id?.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await verifyCertificate(id.trim());
      setResult(data);
      incrementVerificationCount();
    } catch (err) {
      incrementVerificationCount();
      setError(err.response?.data?.message || "Certificate not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeCertificateId) {
      setCertificateId(routeCertificateId);
      checkCertificate(routeCertificateId);
    }
  }, [routeCertificateId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = certificateId.trim();
    if (!id) return;
    navigate(`/verify/${id}`);
    await checkCertificate(id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <FloatingBackground />
      <Navbar />
      <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl rounded-3xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60"
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Certificate Verification</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Enter certificate ID or scan QR code.</p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.15 }}
              type="text"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Enter certificate ID"
              className="w-full rounded-xl border border-slate-300 bg-white/80 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800/80"
            />
            <AnimatedButton type="submit" className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white sm:w-32">
              Verify
            </AnimatedButton>
          </form>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : null}

          {error ? (
            <div className="mt-5">
              <Notification type="error" message={`INVALID: ${error}`} />
              <div className="mt-3">
                <AnimatedButton
                  type="button"
                  onClick={() => navigate("/")}
                  className="border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  Back to Home
                </AnimatedButton>
              </div>
            </div>
          ) : null}

          {result?.certificate ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-success-500/40 bg-success-500/10 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-slate-900 dark:text-white">Certificate Details</h2>
                <StatusBadge status={result.status} />
              </div>
              <div className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Name:</span> {result.certificate.name}
                </p>
                <p>
                  <span className="font-semibold">Event:</span> {result.certificate.event}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {new Date(result.certificate.issueDate).toLocaleDateString()}
                </p>
                <p className="break-all">
                  <span className="font-semibold">Certificate ID:</span> {result.certificate.certificateId}
                </p>
              </div>
              <div className="mt-4">
                <AnimatedButton
                  type="button"
                  onClick={() => navigate("/")}
                  className="border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  Back to Home
                </AnimatedButton>
              </div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyPage;
