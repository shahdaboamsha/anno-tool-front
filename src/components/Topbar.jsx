// src/components/Topbar.jsx
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import clsx from 'clsx';
import { IconButton } from '@mui/material';
import { Popover } from '@mui/material';
import { useState } from 'react';
import UserCard from './UserCard';

export default function Topbar({ toggleSidebar, mode }) {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <header className={clsx("transition-all duration-300 ease-in-out shadow border-b flex items-center justify-between px-4 py-2 sticky top-0 z-10", mode === 'light' ? "bg-white border-gray-200" : "bg-black border-gray-800")}>
      {/* Menu Icon visible on all screen sizes */}
      <IconButton onClick={toggleSidebar}>
        <MenuIcon sx={{
          color: mode === 'light' ? '#000000' : '#ffffff'
        }} />
      </IconButton>


      <div onClick={handleClick} className="flex items-center gap-4 cursor-pointer">
        <Avatar alt="User" src={localStorage.getItem("USER_PROFILE_IMAGE")} />
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="min-w-[500px]">
          <UserCard setOpen={handleClose}/>
        </div>
      </Popover>




    </header >
  );
}
