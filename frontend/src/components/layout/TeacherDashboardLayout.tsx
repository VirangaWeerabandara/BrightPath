import React from 'react';
import { Sidebar } from '../Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full p-8">
        {children}
      </main>
    </div>
  );
};