import AssignedTasks from "./Tasks/AssignedTasks"
import { Typography, Alert } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import InnerLoader from "./InnerLoader"
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"

export default function UserTasks() {

    const location = useLocation()
    const [assignedTasks, setAssignedTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState({message: null})
    const navigate = useNavigate()

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
                setAssignedTasks(assignedTasks.tasks)
            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    setErrorMsg({ message: 'Unable to connect to server' })
                }
                else if (error.response.status === 401) {
                    navigate('/signin', { state: { message: "Access Denied" } })
                }
                else {
                    setErrorMsg({ message: 'Oops, an error occured during the process, please try again' })
                }
            }
        }
        getAssignedTasks()
        setLoading(false)
    }, [])

    return (
        <div className="p-1 ml-5">
            {location.state ? <Alert severity="info" sx={{ mt: 2, mb: 2 }}>{location.state.message? location.state.message : ""}</Alert> : ""}

            {loading ? <InnerLoader /> : <>
                <h1 className="text text-[18px] mt-5">My Tasks</h1>
                <AssignedTasks assignedTasks={assignedTasks} state={errorMsg.message} />
            </>}

        </div>
    )
}