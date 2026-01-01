import React from "react";
import { Sidebar } from "../Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-20 flex-1 p-8 lg:ml-64">{children}</main>
    </div>
  );
};
