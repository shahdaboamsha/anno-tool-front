// src/components/Topbar.jsx
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';

export default function Topbar({ toggleSidebar }) {
  return (
    <header className="bg-white shadow flex items-center justify-between px-4 py-2 sticky top-0 z-10">
      <button className="md:hidden" onClick={toggleSidebar}>
        <MenuIcon />
      </button>
      <h1 className="!text-xl !font-semibold !hidden !md:block">Dashboard</h1>
      <div className="flex items-center gap-4">
        <Avatar alt="User" src="/avatar.jpg" />
      </div>
    </header>
  );
}
