import { motion } from "framer-motion";
import { FaCertificate, FaHome, FaLock, FaSearch } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const links = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/verify", label: "Verify Certificate", icon: FaSearch },
    { to: isLoggedIn ? "/dashboard" : "/login", label: isLoggedIn ? "Dashboard" : "Admin Login", icon: FaLock },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/60"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 p-2 text-white shadow-lg shadow-primary-500/20">
            <FaCertificate className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold md:text-base">Certificate Portal</span>
        </Link>

        <nav className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          {links.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to || (item.to === "/verify" && location.pathname.startsWith("/verify/"));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition md:text-sm ${
                  active
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
