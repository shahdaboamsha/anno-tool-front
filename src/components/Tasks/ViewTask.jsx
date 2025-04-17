import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import InnerLoader from "../InnerLoader"
import axios from "axios"
import TaskDetailsInformation from "./TaskDetailsInformation"
import { Alert, Divider, Button } from "@mui/material"
import TaskSentences from "./TaskSentences"
import StartIcon from '@mui/icons-material/Start';
import AnnotateForm from "./AnnotateForm"
import QuickDialog from "../Dialog"
import { useLocation } from "react-router-dom"
export default function ViewTask() {

    const location = useLocation()
    const navigate = useNavigate()
    const [taskDetails, setTaskDetails] = useState()
    const [numOfSentences, setNumOfSentences] = useState(0)

    const [loading, setLoading] = useState(true)
    const taskIdAsParam = new URLSearchParams(document.location.search).get('task_id')
    taskIdAsParam ? "" : navigate('/dashboard/taskslist', { state: { message: "" } })

    const [AnnotationDialogState, setAnnotationDialogState] = useState(location.state? location.state.openDialog : false)

    const openAnnotateDialog = () => {setAnnotationDialogState(!AnnotationDialogState)}


    useEffect(() => {

        const fetchTaskDetails = async () => {
            try {
                const url = `http://localhost:3000/tasks/${taskIdAsParam}/details`
                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
                }
                const taskDetails = (await axios.get(url, { headers: headers })).data
                setTaskDetails(taskDetails)

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

    const setNumberOfSentences = (rows) => {
        setNumOfSentences(rows)
    }

    return (
        <div className="text-[14px] p-3 relative">
            <Outlet />
            {loading ? <InnerLoader /> : <>
                <h1 className="text-[20px] font-medium p-2">About this task</h1>
                <TaskDetailsInformation task={taskDetails} />

                <Divider variant='middle' />

                <div className="sticky top-0 bg-white z-10 p-2 text-right">
                    <Button
                        variant="contained"
                        color="success"
                        sx={{
                            color: 'white',
                            textTransform: 'none',
                        }}
                        endIcon={<StartIcon />}
                        onClick={() => setAnnotationDialogState(true)}
                    >
                        Start Annotation
                    </Button>
                    <QuickDialog
                        component={<AnnotateForm task={taskDetails} numberOfSentences={numOfSentences}/>}
                        openState={AnnotationDialogState}
                        setOpenState={openAnnotateDialog} />
                </div>

                <h1 className="text-[20px] font-medium p-2">All Sentences</h1>
                <TaskSentences api={`http://localhost:3000/sentence/${taskIdAsParam}/sentences`} setNumberOfSentences={setNumberOfSentences} />
            </>
            }
        </div>
    )
}