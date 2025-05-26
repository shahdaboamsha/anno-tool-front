import AssignedTasks from "../Tasks/AssignedTasks"
import axios from "axios"
import { useEffect, useState } from "react"
import InnerLoader from "../Loaders/InnerLoader"
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { ToggleButtonGroup, ToggleButton, Tooltip, Alert, Button } from "@mui/material";
import SessionController from "../../utils/SessionController";
import ResponseMessage from "../../utils/ResponsesMessage";
axios.defaults.withCredentials = true;
export default function UserTasks() {

    const location = useLocation()
    const [assignedTasks, setAssignedTasks] = useState([])
    const [sharedTasks, setSharedTasks] = useState([])
    const [tasksToRender, setTasksToRender] = useState([])

    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState({ message: null })
    const [tasksEdited, setTaskEdited] = useState(false)

    const notifyChanges = () => setTaskEdited(prev => !prev)

    const navigate = useNavigate()

    useEffect(() => {
        const getAssignedTasks = async () => {
            try {
                const token = localStorage.getItem('ACCESS_TOKEN')

                const url = `${import.meta.env.VITE_API_URL}/users/owned-tasks`
                const headers = {
                    'Authorization': `Bearer ${token}`
                }

                const allTasks = (await axios.get(url, { headers: headers })).data
                setAssignedTasks(allTasks.ownedTasks)
                setSharedTasks(allTasks.sharedTasks)
                setTasksToRender(allTasks.ownedTasks)


            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    setErrorMsg({ message: 'Unable to connect to server' })
                }
                else if (error.response.status === 401) {
                    const refreshError = await SessionController.refreshToken()
                    if (refreshError instanceof Error) {
                        localStorage.removeItem('ACCESS_TOKEN')
                        navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG } })
                    }
                    else {
                        getAssignedTasks()
                    }
                }
                else {
                    setErrorMsg({ message: 'Oops, an error occured during the process, please try again' })
                }
            }
        }
        getAssignedTasks()
        setLoading(false)
    }, [tasksEdited])


    const [alignment, setAlignment] = useState('My Tasks')

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment)

            if (newAlignment === 'My Tasks') {
                setTasksToRender(assignedTasks)
            } else {
                setTasksToRender(sharedTasks)
            }
        }
    };


    return (
        <div className="p-1 ml-5">
            {location.state && <Alert severity="info" sx={{ mt: 2, mb: 2 }}>{location.state.message}</Alert>}

            {loading ? <InnerLoader /> : <>
                <div className="flex justify-between items-end mt-3">
                    <h1 className="text text-[18px] text-center">{alignment}</h1>

                    <ToggleButtonGroup
                        color='success'
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                        onDoubleClick={() => null}

                    >
                        <ToggleButton sx={{ textTransform: 'none' }} value="My Tasks">Owned Tasks</ToggleButton>
                        <ToggleButton sx={{ textTransform: 'none' }} value="Tasks Shared With me">Tasks Shared with me</ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <AssignedTasks assignedTasks={tasksToRender} state={errorMsg.message} notifyChanges={notifyChanges} />
            </>}

        </div>
    )
}