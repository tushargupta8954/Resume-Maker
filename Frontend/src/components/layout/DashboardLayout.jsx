import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  // Sidebar open by default on desktop
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024
  );

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <Navbar
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-4 lg:p-6 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;