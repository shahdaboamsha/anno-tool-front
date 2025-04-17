// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashbordLayout from './../../components/DashboardLayout'
import { Button, IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import InnerLoader from './../../components/InnerLoader';
import DashboardLayout from './../../components/DashboardLayout';
export default function Dashboard({ mode, toggleMode }) {

  const navigate = useNavigate()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = () => {
      return localStorage.getItem('ACCESS_TOKEN') != null
    }
    !isLoggedIn() ? navigate('/signin', {state: {message: "Session expired, Sign in to continue"}}) : setPageLoading(false)
  }, [])

  return (
    <>
      {pageLoading ? <InnerLoader /> : <>
        <div className={clsx("transition-all duration-300 ease-in-out border-b", mode === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-300')}>
          <IconButton onClick={toggleMode} size='large'>
            {mode === 'light' ? <LightModeIcon fontSize='large' sx={{ color: 'yellow' }} /> : <DarkModeIcon fontSize='large' sx={{ color: 'blueviolet' }} />}
          </IconButton>
        </div>

        <DashboardLayout mode={mode} toggleMode={toggleMode} />
      </>
      }
    </>
  );
}
