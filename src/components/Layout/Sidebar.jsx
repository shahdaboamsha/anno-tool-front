import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp  } from "lucide-react";
import clsx from "clsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import axios from "axios";
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import logo from '../../assets/logo.png'

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }
  const [assignedTasks, setAssignedTasks] = useState([])
  const [selectedButton, setSelectedButton] = useState(null)

  useEffect(() => {
    const getAssignedTasks = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN')

        const url = `http://localhost:3000/users/owned-tasks`
        const headers = {
          'Authorization': `Bearer ${token}`
        }

        const assignedTasks = (await axios.get(url, { headers: headers })).data
        setAssignedTasks(assignedTasks.ownedTasks)
      } catch (error) {
        if (error.status == 401) {
          localStorage.removeItem('ACCESS_TOKEN')
          navigate('/signin')
        }
      }
    }
    getAssignedTasks()



  }, [])
  return (
    <aside
      className={clsx(
        "border-r border-gray-300 h-full transition-all duration-300 ease-in-out",
        isOpen ? "w-80" : "w-20",
      )}
    >
      <div className="p-2 text-lg font-bold text-black border-b border-gray-300">
        <a href="/">
          <img
            src={logo}
            width="700px"
            alt="IMAGE"
            loading="lazy"
          />
        </a>
      </div>

      <nav className="flex flex-col  mt-4">

        {/* Overview */}
        <div
          onClick={() => { navigate("overview"); setSelectedButton('overview') }}
          className={clsx(
            "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-300 cursor-pointer rounded-tr-2xl rounded-br-2xl",
            isOpen ? "gap-4" : "justify-center",
            selectedButton === 'overview' ? "bg-gray-300" : ""
          )}
        >
          <DashboardIcon />
          {isOpen && <span className="text-sm">Overview</span>}
        </div>

        {/* New Task */}
        <div
          onClick={() => { navigate("new"); setSelectedButton('new') }}
          className={clsx(
            "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-300 cursor-pointer rounded-tr-2xl rounded-br-2xl",
            isOpen ? "gap-4" : "justify-center",
            selectedButton === 'new' ? "bg-gray-300" : ""
          )}
        >
          <AddIcon />
          {isOpen && <span className="text-sm">New Task</span>}
        </div>

        {/* Tasks Dropdown */}
        <div className="flex flex-col">
          <div
            onClick={() => { toggleDropdown("Tasks"); navigate("taskslist"); setSelectedButton('taskslist') }}
            className={clsx(
              "flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-300 cursor-pointer rounded-tr-2xl rounded-br-2xl",
              isOpen ? "gap-2" : "justify-center",
              selectedButton === 'taskslist'? 'bg-gray-300' : ''
            )}
          >
            <div className="flex items-center gap-4" >
              <AssignmentIcon />
              {isOpen && <span className="text-sm">Tasks</span>}
            </div>
            {isOpen && (
              openDropdown === "Tasks" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )
            )}
          </div>

          {openDropdown === "Tasks" && isOpen && (
            <div className="pl-12 flex flex-col transition-all duration-300">
              <div
                onClick={() => navigate("taskslist")}
                className="text-sm text-gray-600 hover:text-black py-1 cursor-pointer rounded-tr-2xl rounded-br-2xl"
              >
                All Tasks
              </div>
              {
                assignedTasks.map((task, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`viewtask?task_id=${task.task_id}`)}
                    className="text-sm text-gray-600 hover:text-black py-1 cursor-pointer rounded-tr-2xl rounded-br-2xl"
                  >
                    {task.task_name}
                  </div>
                ))
              }

            </div>
          )}
        </div>
        {/* Overview */}
        <div
          onClick={() => { navigate("account"); setSelectedButton('account') }}
          className={clsx(
            "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-300 cursor-pointer rounded-tr-2xl rounded-br-2xl",
            isOpen ? "gap-4" : "justify-center",
            selectedButton === 'account' ? "bg-gray-300" : ""
          )}
        >
          <PersonIcon />
          {isOpen && <span className="text-sm">My Account</span>}
        </div>
        <div
          onClick={() => { navigate("security"); setSelectedButton('security') }}
          className={clsx(
            "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-300 cursor-pointer rounded-tr-2xl rounded-br-2xl",
            isOpen ? "gap-4" : "justify-center",
            selectedButton === 'security' ? "bg-gray-300" : ""
          )}
        >
          <ShieldIcon />
          {isOpen && <span className="text-sm">Security</span>}
        </div>

      </nav>
    </aside>
  );
}
