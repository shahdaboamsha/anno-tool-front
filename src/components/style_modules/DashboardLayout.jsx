// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
export default function DashboardLayout({ mode, toggleMode }) {

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} mode={mode} />
      <div className="flex flex-col flex-1">
        <Topbar toggleSidebar={toggleSidebar} mode={mode} toggleMode={toggleMode} />
        <main className={clsx("p-4 overflow-auto flex-1 transition-all duration-300 ease-in-out", mode === 'light' ? 'bg-white' : 'bg-black')}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
