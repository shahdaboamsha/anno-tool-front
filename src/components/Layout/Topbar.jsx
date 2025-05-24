// src/components/Topbar.jsx
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import clsx from 'clsx';
import { IconButton } from '@mui/material';
import { Popover } from '@mui/material';
import { useState, useEffect } from 'react';
import UserCard from './UserCard';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShareRequestCards from '../Tasks/Shares/ShareRequestCards';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';
import logo from '../../assets/logo.png';
import ResponseMessage from '../../utils/ResponsesMessage';

export default function Topbar({ toggleSidebar }) {

  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [loading, setLoading] = useState(false)
  const [shareRequests, setShareRequests] = useState([])
  const notificationRef = useRef()

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleUserClick = (event) => {
    setUserAnchor(event.currentTarget);
  };

  const closeNotificationPopover = () => setNotificationAnchor(null);
  const closeUserPopover = () => setUserAnchor(null);

  const isNotificationOpen = Boolean(notificationAnchor);
  const isUserOpen = Boolean(userAnchor);

  const navigate = useNavigate()



  useEffect(() => {
    const getRequests = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/tasks/getuserinvitation`
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
        const requests = (await axios.get(url, { headers: headers })).data
        setShareRequests(requests.invitations)
        if (requests.invitations.length != 0) {
          notificationRef.current.classList.toggle('notification-icon')
        }

      } catch (error) {
        if (error.code == "ERR_NETWORK") {
          navigate('/dashboard/taskslist', { state: { message: ResponseMessage.ERR_NETWORK_MSG } })
        }
        else if (error.status == 401) {
          localStorage.removeItem('ACCESS_TOKEN')
          navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG } })
        }
        
      } finally {
        setLoading(false)
      }



    }
    getRequests()
   /* const getRequsestsInterval = setInterval(() => {
      getRequests()
    }, 5000);
    return () => clearInterval(getRequsestsInterval)*/

  }, [])


  return (
    <header
      className={clsx(
        "transition-all duration-300 ease-in-out shadow border-b border-gray-300 flex items-center justify-between px-4 py-0 sticky top-0 z-10",
      )}
    >
      <IconButton onClick={toggleSidebar}>
        <MenuIcon sx={{ color: 'black' }} fontSize='small' />
      </IconButton>
      <div className="pt-1">
        <a href="/">
          <img src={logo} alt="Logo" className='max-w-50 mt-1' loading="lazy" />
        </a>
      </div>
      <div className="flex items-center gap-4 justify-end w-full">

        <IconButton onClick={handleNotificationClick} >
          <Badge color="secondary" badgeContent={shareRequests.length}>
            <div ref={notificationRef}>
              <NotificationsIcon color="action" />
            </div>
          </Badge>
        </IconButton>

        <Avatar
          onClick={handleUserClick}
          alt="User"
          className="cursor-pointer"
          src={localStorage.getItem("USER_PROFILE_IMAGE")}
        />
      </div>

      {/* Notification Popover */}
      <Popover
        id="notification-popover"
        open={isNotificationOpen}
        anchorEl={notificationAnchor}
        onClose={closeNotificationPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <ShareRequestCards shareRequests={shareRequests} loading={loading} setShareRequests={setShareRequests} />
      </Popover>

      {/* User Popover */}
      <Popover
        id="user-popover"
        open={isUserOpen}
        anchorEl={userAnchor}
        onClose={closeUserPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <UserCard setOpen={closeUserPopover} closeUserPopover={closeUserPopover} />
      </Popover>
    </header>
  );
}
