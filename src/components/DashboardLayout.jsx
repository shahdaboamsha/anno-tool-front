// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
export default function DashboardLayout() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize)
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-x-auto">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1">


        <Topbar toggleSidebar={toggleSidebar} />
        <main className={clsx("p-0 pb-5 overflow-x-auto flex-1 transition-all duration-300 ease-in-out")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
