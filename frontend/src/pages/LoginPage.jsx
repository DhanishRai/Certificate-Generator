import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FloatingBackground from "../components/animations/FloatingBackground";
import Navbar from "../components/layout/Navbar";
import Notification from "../components/Notification";
import Spinner from "../components/Spinner";
import AnimatedButton from "../components/ui/AnimatedButton";
import { loginAdmin } from "../services/certificateService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <FloatingBackground />
      <Navbar />
      <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/85"
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to generate and manage certificates.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
                placeholder="********"
              />
            </div>

            {error ? <Notification type="error" message={error} /> : null}

            <AnimatedButton type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
              {loading ? <Spinner small /> : null}
              {loading ? "Signing in..." : "Login"}
            </AnimatedButton>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
