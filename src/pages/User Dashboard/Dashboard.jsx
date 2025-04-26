// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerLoader from '../../components/Loaders/InnerLoader';
import DashboardLayout from '../../components/Layout/DashboardLayout';

export default function Dashboard() {
 document.title = "Dashboard"
  const navigate = useNavigate()
  const [pageLoading, setPageLoading] = useState(true)
  useEffect(() => {
    const isLoggedIn = () => {
      return localStorage.getItem('ACCESS_TOKEN') != null
    }
    !isLoggedIn() ? navigate('/signin', { state: { message: "Session expired. Sign in to continue" } }) : setPageLoading(false)
  }, [])

  return (
    <>
      {pageLoading ? <InnerLoader /> : <DashboardLayout />}
    </>
  )
}
