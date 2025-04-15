import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import InnerLoader from "../InnerLoader"
import axios from "axios"
import TaskDetailsInformation from "./TaskDetailsInformation"
import { Alert } from "@mui/material"

export default function ViewTask() {

    const navigate = useNavigate()
    const [taskDetails, setTaskDetails] = useState()
    const [loading, setLoading] = useState(true)
    const taskIdAsParam = new URLSearchParams(document.location.search).get('task_id')
    taskIdAsParam ? "" : navigate('/dashboard/taskslist', { state: { message: "" } })

    useEffect(() => {

        const fetchTaskDetails = async () => {
            try {
                const url = `http://localhost:3000/tasks/${taskIdAsParam}/details`
                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
                }
                const taskDetails = (await axios.get(url, { headers: headers })).data
                setTaskDetails(taskDetails)
                console.log(taskDetails)
            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    navigate('/dashboard/taskslist', { state: { message: `Oops! An error occured while view the ${taskIdAsParam || ""}, unable to connect with server. Please try again` } })

                }
                else if (error.status == 401) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: "Session expired, Sign in to continue" } })
                }
                else {
                    navigate('/dashboard/taskslist', { state: { message: `Oops! An error occured while view the ${taskIdAsParam || ""}. Please try again` } })
                }
                console.log(error)
            }
            setLoading(false)
        }
        fetchTaskDetails()

    }, [taskIdAsParam])

    return (
        <>
            <Outlet />
            {loading ? <InnerLoader /> : <>
                <TaskDetailsInformation task={taskDetails} />


            </>
            }
        </>
    )
}