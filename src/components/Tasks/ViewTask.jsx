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
import SessionController from "../../utils/SessionController"
import ResponseMessage from "../../utils/ResponsesMessage"
axios.defaults.withCredentials = true;

export default function ViewTask() {

    const location = useLocation()
    const navigate = useNavigate()

    const [taskDetails, setTaskDetails] = useState()
    const [taskFiles, setTaskFiles] = useState([])
    const [taskSentences, setTaskSentences] = useState([])

    const [loading, setLoading] = useState(true)
    const taskIdAsParam = new URLSearchParams(document.location.search).get('task_id')

    const [AnnotationDialogState, setAnnotationDialogState] = useState(location.state ? location.state.openDialog : false)
    const [AnnotatedDialogState, setAnnotatedDialogState] = useState(false)

    const openAnnotateDialog = () => { setAnnotationDialogState(!AnnotationDialogState) }
    const openAnnotatedDialog = () => { setAnnotatedDialogState(!AnnotatedDialogState) }

    useEffect(() => {


        if (!taskIdAsParam) {
            navigate('/dashboard/taskslist', { state: { message: "Task does not exist" } })
        }

        const fetchTaskDetails = async () => {
            try {

                const url1 = `${import.meta.env.VITE_API_URL}/tasks/${taskIdAsParam}/details`
                const url2 = `${import.meta.env.VITE_API_URL}/tasks/${taskIdAsParam}/files`
                const url3 = `${import.meta.env.VITE_API_URL}/sentence/${taskIdAsParam}/sentences`

                const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

                const taskDetails = (await axios.get(url1, { headers })).data
                const taskFiles = (await axios.get(url2, { headers })).data.files
                const taskSentences = (await axios.get(url3, { headers })).data

                setTaskFiles(() => taskFiles)
                setTaskDetails(() => taskDetails)
                setTaskSentences(() => taskSentences)

            } catch (error) {

                if (error.code == "ERR_NETWORK") {
                    navigate('/dashboard/taskslist', { state: { message: ResponseMessage.ERR_NETWORK_MSG } })
                }
                else if (error.status == 401) {
                    const refreshError = await SessionController.refreshToken()
                    if (refreshError instanceof Error) {
                        localStorage.removeItem('ACCESS_TOKEN')
                        navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG, nextUrl: `viewtask?task_id=${taskIdAsParam}` } })
                    }
                    else {
                        await fetchTaskDetails()
                    }
                }
                else {
                    navigate('/dashboard/taskslist', { state: { message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG } })
                }
            } finally {
                setLoading(false)
            }

        }
        fetchTaskDetails()
    }, [])

    return (
        <div className="text-[14px] p-3 relative">
            <Outlet />
            {loading ? <InnerLoader /> : <>

                <TaskDetailsInformation task={taskDetails} taskFiles={taskFiles} />
                <Divider variant='middle' sx={{ mt: 2 }} />

                <div style={{ margin: 'auto', width: 'fit-content' }}>
                    <Button variant="contained" color="success" onClick={openAnnotatedDialog}
                        sx={{ textTransform: 'none', width: '250px', m: 1 }}>
                        View Annotations
                    </Button>
                    <QuickDialog
                        component={<AnnotatedSentences  task={taskDetails} />}
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
                <TaskSentences taskSentences={taskSentences} />
            </>
            }
        </div>
    )
}