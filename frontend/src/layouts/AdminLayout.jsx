import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import FloatingBackground from "../components/animations/FloatingBackground";
import Navbar from "../components/layout/Navbar";
import ThemeToggle from "../components/ui/ThemeToggle";

const AdminLayout = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-primary-50/40 to-secondary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <FloatingBackground />
      <Navbar />
      <div className="relative flex min-h-[calc(100vh-72px)]">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Online Certificate Management</p>
              </div>

              <div className="relative flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  Admin
                </button>
                <AnimatePresence>
                  {menuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                    >
                      <p className="rounded-md px-3 py-2 text-xs text-slate-500 dark:text-slate-400">admin@example.com</p>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("token");
                          window.location.href = "/login";
                        }}
                        className="w-full rounded-md px-3 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10"
                      >
                        Logout
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </header>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
