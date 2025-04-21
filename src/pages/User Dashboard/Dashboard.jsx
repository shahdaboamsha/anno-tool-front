// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerLoader from './../../components/InnerLoader';
import DashboardLayout from './../../components/DashboardLayout';

export default function Dashboard() {

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

        <DashboardLayout />
      </>
      }
    </>
  );
}
