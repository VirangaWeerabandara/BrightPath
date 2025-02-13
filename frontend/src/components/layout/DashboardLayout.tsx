import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaUserGraduate,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", icon: FaHome, path: "/dashboard" },
    { name: "My Courses", icon: FaBook, path: "/my-courses" },
    { name: "Profile", icon: FaUserGraduate, path: "/profile" },
    { name: "Settings", icon: FaCog, path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold text-purple-600">BrightPath</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <FaTimes className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-4">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 transition-colors ${
                location.pathname === item.path
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`lg:hidden ${isSidebarOpen ? "hidden" : ""}`}
          >
            <FaBars className="h-6 w-6 text-gray-500" />
          </button>

          {/* Profile Section */}
          <div className="ml-auto flex items-center space-x-4">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-purple-100">
              <img
                src="https://via.placeholder.com/32"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
