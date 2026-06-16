import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Settings, LogOut, User, ChevronDown,
  Menu, X, Sparkles, Moon, Sun, FileText,
  BarChart3, Home, Plus,
} from "lucide-react";

import { selectUser } from "../../features/auth/authSlice.js";
import { logoutUser } from "../../features/auth/authSlice.js";
import { selectUnsavedChanges } from "../../features/resume/resumeSlice.js";
import Avatar from "../common/Avatar.jsx";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";

const navLinks = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/resumes", label: "My Resumes", icon: FileText },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

const Navbar = ({ onMenuToggle, isSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const unsavedChanges = useSelector(selectUnsavedChanges);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-md shadow-indigo-200/50"
            >
              <span className="text-white font-bold text-base font-display">R</span>
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-800 text-lg font-display leading-none">
                ResumeAI
              </span>
              <span className="block text-[10px] text-slate-400 leading-none mt-0.5">
                Build. Impress. Get Hired.
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive(path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Unsaved indicator */}
          <AnimatePresence>
            {unsavedChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="warning" dot size="sm">
                  Unsaved
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* New Resume Button */}
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate("/resumes/new")}
            className="hidden sm:flex"
          >
            New Resume
          </Button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-strong border border-slate-100 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    <Badge variant="primary" size="xs">3 new</Badge>
                  </div>
                  {[
                    { icon: "🤖", title: "AI Summary Generated", desc: "Your professional summary is ready!", time: "2m ago" },
                    { icon: "📊", title: "ATS Score Updated", desc: "Your resume score improved to 82!", time: "1h ago" },
                    { icon: "🎯", title: "Resume Tip Available", desc: "Add 3 more skills to boost your score", time: "3h ago" },
                  ].map((notif, i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{notif.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{notif.desc}</p>
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 text-center">
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Avatar
                src={user?.profileImage?.url}
                firstName={user?.firstName}
                lastName={user?.lastName}
                size="sm"
                showStatus
                status="online"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-none">
                  {user?.firstName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">
                  {user?.subscription?.plan || "Free"} Plan
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-strong border border-slate-100 overflow-hidden z-50"
                >
                  {/* User info */}
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user?.profileImage?.url}
                        firstName={user?.firstName}
                        lastName={user?.lastName}
                        size="md"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <Badge variant="primary" size="xs" className="mt-1">
                          {user?.subscription?.plan || "Free"} Plan
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    {[
                      { icon: User, label: "Profile Settings", path: "/profile" },
                      { icon: BarChart3, label: "Analytics", path: "/analytics" },
                      { icon: Sparkles, label: "Upgrade to Pro", path: "/upgrade", highlight: true },
                      { icon: Settings, label: "Preferences", path: "/settings" },
                    ].map(({ icon: Icon, label, path, highlight }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          highlight
                            ? "text-indigo-600 hover:bg-indigo-50 font-medium"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                        {highlight && (
                          <Badge variant="gradient" size="xs" className="ml-auto">
                            Pro
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(profileOpen || notifOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setProfileOpen(false); setNotifOpen(false); }}
        />
      )}
    </nav>
  );
};

export default Navbar;