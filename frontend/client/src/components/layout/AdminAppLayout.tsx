import React, { useEffect, useState } from "react";
import { ThemeToggle } from "@/lib/ThemeProvider";
import { Link, useLocation } from "wouter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import BrandLogo from "@/components/common/BrandLogo";

interface AdminAppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const adminMenuItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    href: "/admin/dashboard",
  },
  {
    label: "Prakriti Finalization",
    icon: <AssessmentIcon fontSize="small" />,
    href: "/admin/prakriti-finalization",
  },
  {
    label: "Wellness Network",
    icon: <LibraryBooksIcon fontSize="small" />,
    href: "/admin/wellness-network",
  },
  {
    label: "Settings",
    icon: <SettingsIcon fontSize="small" />,
    href: "/admin/settings",
  },
];

const AdminAppLayout: React.FC<AdminAppLayoutProps> = ({
  children,
  showSidebar = true,
}) => {
  const [location, setLocation] = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [location]);

  const handleLogout = () => {
    setIsMobileSidebarOpen(false);
    setLocation("/login");
  };

  const renderSidebar = (onNavigate?: () => void) => (
    <nav className="p-4">
      <ul className="space-y-2">
        {adminMenuItems.map((item) => (
          <li key={item.label}>
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-lg">
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent ${
                  location === item.href ? "font-semibold text-primary" : ""
                }`}
              >
                {location === item.href && (
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
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </motion.div>
          </li>
        ))}
        <li className="pt-4 mt-4 border-t border-sidebar-border md:hidden">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center p-2 rounded-lg relative transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogoutIcon fontSize="small" />
            <span className="ml-3">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col md:flex-row">
      {showSidebar && (
        <aside className="hidden md:flex bg-sidebar w-64 lg:w-72 border-r border-sidebar-border shrink-0 shadow-xl flex-col">
          <div className="p-4 h-16 border-b border-sidebar-border flex items-center justify-between">
            <BrandLogo textClassName="text-2xl" iconClassName="h-9 w-9" />
            <ThemeToggle />
          </div>
          {renderSidebar()}
        </aside>
      )}

      {showSidebar && isMobileSidebarOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-sidebar border-r border-sidebar-border shadow-2xl md:hidden flex flex-col">
            <div className="p-4 h-16 border-b border-sidebar-border flex items-center">
              <BrandLogo textClassName="text-2xl" iconClassName="h-9 w-9" />
            </div>
            {renderSidebar(() => setIsMobileSidebarOpen(false))}
          </aside>
        </>
      )}

      <main className="flex-1 flex flex-col min-h-0">
          <header className="h-16 border-b border-border flex items-center justify-end px-4 md:px-6 bg-card shrink-0">
          <div className="flex items-center space-x-2 md:space-x-4">
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

            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon fontSize="small" />
              <span>Logout</span>
            </button>

            {showSidebar && (
              <div className="md:hidden flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
                  className="p-2 rounded-md hover:bg-sidebar-accent/50"
                  aria-label={isMobileSidebarOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileSidebarOpen}
                >
                  {isMobileSidebarOpen ? (
                    <CloseIcon fontSize="small" />
                  ) : (
                    <MenuIcon fontSize="small" />
                  )}
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminAppLayout;
