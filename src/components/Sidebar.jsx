// src/components/Sidebar.jsx
import React from 'react';
import clsx from 'clsx';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard'
import AddIcon from '@mui/icons-material/Add';

const navItems = [
  { icon: <DashboardIcon />, label: 'Overview', link: 'overview' },
  { icon: <AddIcon />, label: 'New Task', link: 'new' },
  { icon: '', label: 'Loader Test', link: 'loader' },
  { icon: <AssignmentIcon />, label: 'My Tasks', link: 'mytasks' }
];

export default function Sidebar({ isOpen, mode }) {
  const navigate = useNavigate()
  return (
    <aside
      className={clsx(
        "border-r h-full transition-all duration-300 ease-in-out",
        // Sidebar should be expanded on large screens (w-64) and collapsed on smaller screens (w-16)
        isOpen ? "w-64" : "w-16", // Dynamically set the width based on isOpen
        mode === 'light' ? "bg-gray-100 border-gray-200" : "bg-black border-gray-800"
      )}
    >
      <div className={clsx("p-4 text-lg font-bold text-black")}>
        <a href="/">
          <img src='https://png.pngtree.com/png-clipart/20190628/original/pngtree-artificial-intelligence-blue-technology-mechanical-gear-ai-brain-commercial-material-png-image_4030085.jpg' width='40px' alt="IMAGE" loading='lazy' />
        </a>
      </div>

      <nav className="flex flex-col space-y-1 mt-4">
        {navItems.map((item, i, link) => (
          <div
            onClick={() => navigate(item.link)}
            key={i}
            className="flex items-center gap-4 px-4 py-2 text-gray-700 hover:bg-white cursor-pointer"
          >
            <span>{item.icon}</span>
            {isOpen && <span className="text-sm">{item.label}</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
}
