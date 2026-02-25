import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardIcon, MenuIcon, VerifyIcon } from "./ui/Icons";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <motion.aside
      animate={{ width: collapsed ? 86 : 256 }}
      className="h-screen shrink-0 overflow-hidden border-r border-slate-200 bg-white/90 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">{collapsed ? "AG" : "Admin Panel"}</h1>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg border border-slate-200 p-1.5 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <MenuIcon />
        </button>
      </div>
      <nav className="mt-6 space-y-2">
        <Link to="/dashboard" className={navLinkClass("/dashboard")}>
          <DashboardIcon />
          {!collapsed ? "Certificates" : null}
        </Link>
        <Link to="/verify" className={navLinkClass("/verify")}>
          <VerifyIcon />
          {!collapsed ? "Public Verify" : null}
        </Link>
      </nav>
      <button
        onClick={handleLogout}
        className="mt-8 w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        {collapsed ? "Out" : "Logout"}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
