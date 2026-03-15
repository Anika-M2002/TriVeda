import React from "react";
import { ThemeToggle } from "@/lib/ThemeProvider";
import { Link, useLocation } from "wouter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { motion } from "framer-motion";
import BrandLogo from "@/components/common/BrandLogo";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  userType?: "patient" | "doctor" | "admin";
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = true,
  userType = "patient",
}) => {
  const [location] = useLocation();
  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col md:flex-row">
      {showSidebar && (
        <aside className="bg-sidebar w-full md:w-64 lg:w-72 border-r border-sidebar-border shrink-0 shadow-xl flex flex-col">
          <div className="p-4 h-16 border-b border-sidebar-border flex items-center justify-between">
            <BrandLogo textClassName="text-2xl" iconClassName="h-9 w-9" />
            <ThemeToggle />
          </div>
          <nav className="p-4 flex-1 overflow-y-auto">
            {userType === "patient" && (
              <ul className="space-y-2">
                <li>
                  <Link href="/patient/dashboard">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent ${
                        location === "/patient/dashboard"
                          ? "font-semibold text-primary"
                          : ""
                      }`}
                    >
                      {location === "/patient/dashboard" && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-0 h-full w-1 bg-[#1F5C3F] rounded-r"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <DashboardIcon fontSize="small" />
                      <span className="ml-3">Dashboard</span>
                    </motion.a>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/diet-charts">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent ${
                        location === "/patient/diet-charts"
                          ? "font-semibold text-primary"
                          : ""
                      }`}
                    >
                      {location === "/patient/diet-charts" && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-0 h-full w-1 bg-[#1F5C3F] rounded-r"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <RestaurantMenuIcon fontSize="small" />
                      <span className="ml-3">My Diet Charts</span>
                    </motion.a>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/health-records">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent ${
                        location === "/patient/health-records"
                          ? "font-semibold text-primary"
                          : ""
                      }`}
                    >
                      {location === "/patient/health-records" && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-0 h-full w-1 bg-[#1F5C3F] rounded-r"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <AssignmentIcon fontSize="small" />
                      <span className="ml-3">Health Records</span>
                    </motion.a>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/reports">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent ${
                        location === "/patient/reports"
                          ? "font-semibold text-primary"
                          : ""
                      }`}
                    >
                      {location === "/patient/reports" && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-0 h-full w-1 bg-[#1F5C3F] rounded-r"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <AssessmentIcon fontSize="small" />
                      <span className="ml-3">Reports</span>
                    </motion.a>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/appointments">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent ${
                        location === "/patient/appointments"
                          ? "font-semibold text-primary"
                          : ""
                      }`}
                    >
                      {location === "/patient/appointments" && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-0 h-full w-1 bg-[#1F5C3F] rounded-r"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <LocalHospitalIcon fontSize="small" />
                      <span className="ml-3">Appointments</span>
                    </motion.a>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/profile">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent ${
                        location === "/patient/profile"
                          ? "font-semibold text-primary"
                          : ""
                      }`}
                    >
                      {location === "/patient/profile" && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-0 h-full w-1 bg-[#1F5C3F] rounded-r"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <PersonIcon fontSize="small" />
                      <span className="ml-3">Profile</span>
                    </motion.a>
                  </Link>
                </li>
                <li>
                  <Link href="/patient/settings">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent ${
                        location === "/patient/settings"
                          ? "font-semibold text-primary"
                          : ""
                      }`}
                    >
                      {location === "/patient/settings" && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-0 h-full w-1 bg-[#1F5C3F] rounded-r"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <SettingsIcon fontSize="small" />
                      <span className="ml-3">Settings</span>
                    </motion.a>
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </aside>
      )}
      <main className="flex-1 flex flex-col min-h-0">
          <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-card shrink-0">
          <div className="md:hidden">
            {showSidebar && (
              <button className="p-2 rounded-md hover:bg-sidebar-accent/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-1 text-sm font-medium">
                <span>Account</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
