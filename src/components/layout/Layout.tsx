import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Activity,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import toast from "react-hot-toast";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "dashboard" | "test-creation" | "test-tracking";
  breadcrumbs?: string[];
}

export default function Layout({ children, activeTab, breadcrumbs }: LayoutProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "test-creation", label: "Test Creation", icon: ClipboardList, path: "/tests/create" },
    { id: "test-tracking", label: "Test Tracking", icon: Activity, path: "/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 flex-shrink-0">
        
        <div className="h-20 px-6 border-b border-slate-100 flex items-center select-none">
          <svg
            viewBox="0 0 160 50"
            fill="none"
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer h-9 w-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 32 C 10 18, 50 12, 60 14 C 70 16, 90 28, 100 28 C 110 28, 130 14, 150 14"
              stroke="#1e3a8a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M10 32 C 10 18, 50 12, 60 14 C 70 16, 90 28, 100 28 C 110 28, 130 14, 150 14"
              stroke="#60a5fa"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="10" cy="32" r="4.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="150" cy="14" r="4.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
            <text x="14" y="40" fill="#2563eb" fontWeight="800" fontSize="24">P</text>
            <text x="30" y="40" fill="#2563eb" fontWeight="800" fontSize="24">reproute</text>
          </svg>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="w-64 max-w-xs h-full bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
              <svg
                viewBox="0 0 160 50"
                fill="none"
                className="h-8 w-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 32 C 10 18, 50 12, 60 14 C 70 16, 90 28, 100 28 C 110 28, 130 14, 150 14"
                  stroke="#1e3a8a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M10 32 C 10 18, 50 12, 60 14 C 70 16, 90 28, 100 28 C 110 28, 130 14, 150 14"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="10" cy="32" r="4.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="150" cy="14" r="4.5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
                <text x="14" y="40" fill="#2563eb" fontWeight="800" fontSize="24">P</text>
                <text x="30" y="40" fill="#2563eb" fontWeight="800" fontSize="24">reproute</text>
              </svg>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-800 p-1"
            >
              <Menu size={22} />
            </button>

            <div className="text-sm font-medium text-slate-400 hidden sm:flex items-center gap-2">
              {breadcrumbs ? (
                breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    <span
                      className={
                        idx === breadcrumbs.length - 1
                          ? "text-slate-600 font-semibold"
                          : "hover:text-slate-600 transition cursor-pointer"
                      }
                      onClick={() => {
                        if (crumb === "Test Creation") navigate("/tests/create");
                        else if (crumb === "Dashboard") navigate("/dashboard");
                      }}
                    >
                      {crumb}
                    </span>
                  </React.Fragment>
                ))
              ) : (
                <span className="text-slate-600 font-semibold">
                  {activeTab === "dashboard" ? "Dashboard" : activeTab === "test-creation" ? "Test Creation" : "Test Tracking"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            <button className="relative p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1 px-3 rounded-full hover:bg-slate-50 transition cursor-pointer text-left"
              >
                
                <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                  <span className="text-sm">AW</span>
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-semibold text-slate-700 leading-none">
                    Alex Wando
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    Admin
                  </div>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
