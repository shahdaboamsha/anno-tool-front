// src/components/DashboardLayout.jsx
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import { createContext } from "react";
import Loader from '../Loaders/Loader';
import { useNavigate } from 'react-router-dom';
import ResponseMessage from '../../utils/ResponsesMessage';
import SessionController from '../../utils/SessionController';
import { use } from 'react';

export const UserContext = createContext()
export default function DashboardLayout() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [userData, setUserData] = useState()
  const [userEdited, setUserEdited] = useState(false)
  const [loading, setLoading] = useState(true)

  const notifyEditingUser = () => setUserEdited(!userEdited)
  const navigate = useNavigate()

  useEffect(() => {

    axios.defaults.withCredentials = true
    const getUserData = async () => {
      const url = `${import.meta.env.VITE_API_URL}/users/getUserData`
      const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

      try {
        const userData = (await axios.get(url, { headers: headers, withCredentials: true })).data
        setUserData({ ...userData })
      } catch (error) {
        if (error.code == "ERR_NETWORK") {
          localStorage.removeItem('ACCESS_TOKEN')
          navigate('/signin', { state: { message: ResponseMessage.ERR_NETWORK_MSG } })
        }
        else if (error.status == 401) {
          const refreshError = await SessionController.refreshToken()
          if (refreshError instanceof Error) {
            localStorage.removeItem('ACCESS_TOKEN')
            navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG } })
            return
          }
          getUserData()
        }
        else {
          localStorage.removeItem('ACCESS_TOKEN')
          navigate('/signin', { state: { message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG } })
        }
      }
      setLoading(false)
    }
    getUserData()
  }, [userEdited])

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  return (
    <>
      {loading ? <Loader /> :
        <div className="flex h-screen overflow-x-auto">
          <Sidebar isOpen={isSidebarOpen} role={userData?.role || 'user'} toggleSidebar={toggleSidebar} />
          <div className="flex flex-col flex-1">
            <UserContext.Provider value={{ userData }}>
              <Topbar toggleSidebar={toggleSidebar} userName={userData?.userName || "unknown"} />
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
