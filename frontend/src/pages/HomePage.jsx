import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FloatingBackground from "../components/animations/FloatingBackground";
import Navbar from "../components/layout/Navbar";
import AnimatedButton from "../components/ui/AnimatedButton";

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <FloatingBackground />
      <Navbar />

      <main className="relative mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center px-4 py-12 md:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full rounded-3xl border border-white/40 bg-white/65 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 md:p-12"
        >
          <p className="inline-block rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
            Certificate Generation & Verification
          </p>
          <h1 className="mt-4 bg-gradient-to-r from-primary-700 via-secondary-600 to-accent-600 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            Build, Share, and Verify Certificates with Confidence
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
            Use the admin dashboard to generate professional certificates and send them by email. Anyone can verify authenticity with a certificate ID or QR code.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/verify">
              <AnimatedButton className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                Verify Certificate
              </AnimatedButton>
            </Link>
            <Link to="/login">
              <AnimatedButton className="border border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                Admin Login
              </AnimatedButton>
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default HomePage;
