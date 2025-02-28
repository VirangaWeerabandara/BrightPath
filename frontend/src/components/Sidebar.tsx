import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
  FaBookOpen,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <FaTachometerAlt className="size-5 text-current" />,
    },
    {
      path: "/create-course",
      name: "Create Course",
      icon: <FaPlus className="size-5 text-current" />,
    },
    {
      path: "/my-courses",
      name: "My Courses",
      icon: <FaBookOpen className="size-5 text-current" />,
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 z-20 flex h-screen flex-col border-r bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 rounded-full border bg-white p-1.5 shadow-md transition-all duration-200 hover:shadow-lg"
      >
        {isCollapsed ? (
          <FaChevronRight className="size-4 text-gray-600" />
        ) : (
          <FaChevronLeft className="size-4 text-gray-600" />
        )}
      </button>

      {/* Logo and App Name */}
      <div
        onClick={() => navigate("/")}
        className={`flex cursor-pointer items-center border-b p-4 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <img src={logo} alt="BrightPath Logo" className="size-8" />
        {!isCollapsed && (
          <span className="ml-2 text-xl font-bold text-gray-900">
            BrightPath
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-3 px-3 py-4">
        {" "}
        {/* Increased space-y from 1 to 3 */}
        {navigationItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center rounded-lg p-3 transition-all duration-200 ${
              isActive(item.path)
                ? "bg-primary-600 text-white"
                : "text-gray-600 hover:border-2 hover:border-primary-600 hover:text-primary-600"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className={isCollapsed ? "" : "mr-3"}>{item.icon}</div>
            {!isCollapsed && <span className="text-sm">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* Profile and Logout Section */}
      <div className="border-t p-4">
        <button
          onClick={() => navigate("/profile")}
          className={`mb-4 flex w-full items-center rounded-lg p-2 transition-all duration-200 hover:border-2 hover:border-primary-600 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <img
            className="size-8 rounded-full"
            src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
            alt="Profile"
          />
          {!isCollapsed && (
            <div className="ml-3 flex-1 text-left">
              <p className="truncate text-sm text-gray-900">
                {`${user.firstName} ${user.lastName}`}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          )}
        </button>

        <button
          onClick={handleLogout}
          className={`flex w-full items-center rounded-lg p-3 text-red-600 transition-all duration-200 hover:bg-red-50 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <FaSignOutAlt className="size-5" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};
