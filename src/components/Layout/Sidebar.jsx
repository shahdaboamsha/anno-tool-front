import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Shield";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import logo from '../../assets/logo.png';
import ResponseMessage from "../../utils/ResponsesMessage";
import SessionController from "../../utils/SessionController";
export default function Sidebar({ isOpen, toggleSidebar, role = "admin" }) {
  const navigate = useNavigate();
  const [openTasks, setOpenTasks] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const getAssignedTasks = async () => {
      try {
        axios.defaults.withCredentials = true
        const token = localStorage.getItem("ACCESS_TOKEN");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/owned-tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            
          }, withCredentials: true,
        });
        setAssignedTasks(response.data.ownedTasks);
      } catch (error) {
        if (error.response?.status === 401) {
          const refreshError = await SessionController.refreshToken()
          if (refreshError instanceof Error) {
            localStorage.removeItem('ACCESS_TOKEN')
            navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG } })
          }
          await getAssignedTasks();
        }
      }
    };
    getAssignedTasks();
  }, [navigate]);

  const handleNavigation = (path, key) => {
    setSelected(key);
    navigate(path);
  };

  return (
    <Drawer
      anchor="left"
      variant="temporary"
      onClose={toggleSidebar}
      open={isOpen}
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
        }
      }}
      sx={{
        position: 'absolute',
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: "300px",
          boxSizing: 'border-box',
        },
      }}
    >
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton selected={selected === 'overview'} onClick={() => handleNavigation('overview', 'overview')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton selected={selected === 'new'} onClick={() => handleNavigation('new', 'new')}>
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText primary="New Task" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => {
            setOpenTasks(!openTasks);
            handleNavigation('taskslist', 'taskslist');
          }} selected={selected === 'taskslist'}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Tasks" />
            {openTasks ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openTasks} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('taskslist')}>
              <ListItemText primary="All Tasks" />
            </ListItemButton>
            {assignedTasks.map((task, index) => (
              <ListItemButton
                key={index}
                sx={{ pl: 4 }}
                onClick={() => navigate(`viewtask?task_id=${task.task_id}`)}
              >
                <ListItemText primary={task.task_name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton selected={selected === 'account'} onClick={() => handleNavigation('account', 'account')}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="My Account" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton selected={selected === 'security'} onClick={() => handleNavigation('security', 'security')}>
            <ListItemIcon><ShieldIcon /></ListItemIcon>
            <ListItemText primary="Security" />
          </ListItemButton>
        </ListItem>

        {role === 'admin' && (
          <ListItem disablePadding>
            <ListItemButton selected={selected === 'administration'} onClick={() => {
              handleNavigation('administration', 'administration');
            }}>
              <ListItemIcon><ManageAccountsIcon /></ListItemIcon>
              <ListItemText primary="Management" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}
