import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, SectionIcon } from "lucide-react";
import clsx from "clsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import axios from "axios";
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';

export default function Sidebar({ isOpen, mode }) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const [assignedTasks, setAssignedTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(0)


  useEffect(() => {
    const getAssignedTasks = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN')

        const url = `http://localhost:3000/users/owned-tasks`
        // url must be : http://localhost:3000/users/owned-tasks 
        // there is no need for send task id as parameter in url, the token contatins it 
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
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="p-2 text-lg font-bold text-black border-b border-gray-300">
        <a href="/">
          <img
            src="https://png.pngtree.com/png-clipart/20190628/original/pngtree-artificial-intelligence-blue-technology-mechanical-gear-ai-brain-commercial-material-png-image_4030085.jpg"
            width="50px"
            alt="IMAGE"
            loading="lazy"
          />
        </a>
      </div>

      <nav className="flex flex-col space-y-1 mt-4">

        {/* Overview */}
        <div
          onClick={() => navigate("overview")}
          className={clsx(
            "flex items-center px-4 py-2 text-gray-700 hover:bg-white cursor-pointer",
            isOpen ? "gap-4" : "justify-center"
          )}
        >
          <DashboardIcon />
          {isOpen && <span className="text-sm">Overview</span>}
        </div>

        {/* New Task */}
        <div
          onClick={() => navigate("new")}
          className={clsx(
            "flex items-center px-4 py-2 text-gray-700 hover:bg-white cursor-pointer",
            isOpen ? "gap-4" : "justify-center"
          )}
        >
          <AddIcon />
          {isOpen && <span className="text-sm">New Task</span>}
        </div>

        {/* Tasks Dropdown */}
        <div className="flex flex-col">
          <div
            onClick={() => toggleDropdown("Tasks")}
            className={clsx(
              "flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-white cursor-pointer",
              isOpen ? "gap-2" : "justify-center"
            )}
          >
            <div className="flex items-center gap-4">
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
                className="text-sm text-gray-600 hover:text-black py-1 cursor-pointer"
              >
                All Tasks
              </div>
              {
                assignedTasks.map((task, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`viewtask?task_id=${task.task_id}`)}
                    className="text-sm text-gray-600 hover:text-black py-1 cursor-pointer"
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
          onClick={() => navigate("account")}
          className={clsx(
            "flex items-center px-4 py-2 text-gray-700 hover:bg-white cursor-pointer",
            isOpen ? "gap-4" : "justify-center"
          )}
        >
          <PersonIcon />
          {isOpen && <span className="text-sm">My Account</span>}
        </div>
        <div
          onClick={() => navigate("security")}
          className={clsx(
            "flex items-center px-4 py-2 text-gray-700 hover:bg-white cursor-pointer",
            isOpen ? "gap-4" : "justify-center"
          )}
        >
          <ShieldIcon />
          {isOpen && <span className="text-sm">Security</span>}
        </div>

      </nav>
    </aside>
  );
}
