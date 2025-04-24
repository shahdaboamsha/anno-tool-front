// src/components/DashboardLayout.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import { createContext } from "react";
import Loader from '../Loaders/Loader';
import { useNavigate } from 'react-router-dom';
export const UserContext = createContext()
import { useMediaQuery, useTheme } from '@mui/material';

export default function DashboardLayout() {
  const theme = useTheme()
  const isWideScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isWideScreen)

  const [userData, setUserData] = useState()
  const [userEdited, setUserEdited] = useState(false)
  const [loading, setLoading] = useState(true)

  const notifyEditingUser = () => setUserEdited(!userEdited)
  const navigate = useNavigate()
  useEffect(() => {

    const getUserData = async () => {
      const url = 'http://localhost:3000/users/getUserData'
      const headers = { Authorization: `Beared ${localStorage.getItem('ACCESS_TOKEN')}` }

      try {
        setUserData((await axios.get(url, { headers: headers })).data)
      } catch (error) {
        if (error.code == "ERR_NETWORK") {
          localStorage.removeItem('ACCESS_TOKEN')
          navigate('/signin', { state: { message: 'An error occured while connecting with server. Please sign in and try again' } })
        }
        else if (error.status == 401) {
          localStorage.removeItem('ACCESS_TOKEN')
          navigate('/signin', { state: { message: 'Session Expired. Sign in again to continue' } })
        }
        else if (error.status == 404) {
          localStorage.removeItem('ACCESS_TOKEN')
          navigate('/signin', { state: { message: 'Access Denied' } })
        }
      }
      setLoading(false)
    }
    getUserData()
  }, [userEdited])

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  }

  return (
    <>
      {loading ? <Loader /> :
        <div className="flex h-screen overflow-x-auto">
          <Sidebar isOpen={isSidebarOpen} />
          <div className="flex flex-col flex-1">
            <UserContext.Provider value={{ userData }}>
              <Topbar toggleSidebar={toggleSidebar} userName={userData.userName} />
            </UserContext.Provider>

            <main className={clsx("p-0 pb-5 overflow-x-auto flex-1 transition-all duration-300 ease-in-out")}>
              <Outlet context={{
                userData, notifyEditingUser
              }} />
            </main>
          </div>
        </div>
      }
    </>
  );
}
