import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import InnerLoader from "../Loaders/InnerLoader"
import axios from "axios"
import TaskDetailsInformation from "./Details/TaskDetails"
import { Divider } from "@mui/material"
import TaskSentences from "./Sentences/TaskSentences"
import AnnotateForm from "./Annotations/AnnotateForm"
import QuickDialog from "../Public/QuickDialog"
import { useLocation } from "react-router-dom"
import AnimatedButton from "../Inputs/AnimatedButton"
import { Button } from "@mui/material"
import AnnotatedSentences from "./Annotations/AnnotatedSentences"

export default function ViewTask() {

    const location = useLocation()
    const navigate = useNavigate()
    const [taskDetails, setTaskDetails] = useState()

    const [loading, setLoading] = useState(true)
    const taskIdAsParam = new URLSearchParams(document.location.search).get('task_id')

    const [AnnotationDialogState, setAnnotationDialogState] = useState(location.state ? location.state.openDialog : false)
    const [AnnotatedDialogState, setAnnotatedDialogState] = useState(false)

    const openAnnotateDialog = () => { setAnnotationDialogState(!AnnotationDialogState) }
    const openAnnotatedDialog = () => { setAnnotatedDialogState(!AnnotatedDialogState) }


    useEffect(() => {
        taskIdAsParam ? "" : navigate('/dashboard/taskslist', { state: { message: "Task does not exist" } })

        const fetchTaskDetails = async () => {
            try {
                const url = `http://localhost:3000/tasks/${taskIdAsParam}/details`
                const headers = {  Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

                const taskDetails = (await axios.get(url, { headers: headers })).data
                setTaskDetails(taskDetails)
            } catch (error) {

                if (error.code == "ERR_NETWORK") {
                    navigate('/dashboard/taskslist', { state: { message: `Task does not exist` } })
                }
                else if (error.status == 401) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: "Session expired. Sign in to continue" } })
                }
                else {
                    navigate('/dashboard/taskslist', { state: { message: `Task does not exist` } })
                }

                console.log(error)
            }
            setLoading(false)
        }
        fetchTaskDetails()

    }, [taskIdAsParam])

    return (
        <div className="text-[14px] p-3 relative">
            <Outlet />
            {loading ? <InnerLoader /> : <>
                <TaskDetailsInformation task={taskDetails} />
                <Divider variant='middle' sx={{ mt: 2 }} />
                <div style={{ margin: 'auto', width: 'fit-content' }}>
                    <Button variant="contained" color="success" onClick={openAnnotatedDialog}
                        sx={{ textTransform: 'none', width: '250px', m: 1 }}>
                        View Annotations
                    </Button>
                    <QuickDialog
                        component={<AnnotatedSentences taskId={taskDetails.task_id} />}
                        openState={AnnotatedDialogState}
                        setOpenState={openAnnotatedDialog} />
                </div>

                <Divider variant='middle' sx={{ mt: 0 }} />
                <Divider variant='middle' sx={{ mt: 0 }} />

                <div className="sticky top-0 bg-white z-10 p-2 text-right">
                    <AnimatedButton onClick={() => setAnnotationDialogState(true)} />
                    <QuickDialog
                        component={<AnnotateForm task={taskDetails} />}
                        openState={AnnotationDialogState}
                        setOpenState={openAnnotateDialog}
                        fullScreen={true}
                    />
                </div>


                <h1 className="text-[20px] font-medium p-2">All Sentences</h1>
                <TaskSentences api={`http://localhost:3000/sentence/${taskIdAsParam}/sentences`} />
            </>
            }
        </div>
    )
}