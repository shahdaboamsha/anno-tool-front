import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RadioButtonGroup from "../RadioButton"
import InnerLoader from "../InnerLoader"
import { Alert, Button, Divider } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CircularProgress from "../CircularProgress"


export default function AnnotateForm({ task }) {
    const navigate = useNavigate()
    const [alertMsg, setAlertMsg] = useState({
        isError: false,
        message: null
    })
    const [sentenceToAnnotate, setSentenceToAnnotate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submittingLoading, setSubmittingLoading] = useState(false)
    const [getNext, setGetNext] = useState(0)

    const [numOfAnnotatedSentences, setNumOfAnnotatedSentences] = useState(task.annotatedCount)
    const [numOfSkippedSentences, setNumOfSkippedSentences] = useState(task.skippedCount)

    useEffect(() => {

        const getSentenceToAnnotate = async () => {
            setSelectedLabel(null)
            setAlertMsg({ isError: false, message: null })
            setLoading(true)
            try {
                const url = `http://localhost:3000/tasks/${task.task_id}/sentences/unannotated`
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
                }

                const sentenceToAnnotate = (await axios.get(url, { headers: headers })).data
                setSentenceToAnnotate(sentenceToAnnotate.nextSentence)
                
            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    setAlertMsg({ isError: true, message: "Unable to connect server" })
                }
                else if (error.status == 401) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: 'Session Expired. Sign in to continue', nextUrl: `viewtask?task_id=${task.task_id}`, openDialog: true } })
                }
                else {
                    setAlertMsg({ isError: true, message: 'Oops! An error occured duting fetching sentence. Try Again' })
                }
            }
            setLoading(false)
        }
        getSentenceToAnnotate()
    }, [task, getNext])


    const [selectedLabel, setSelectedLabel] = useState(null)

    const handleLabelSelection = (selection) => setSelectedLabel(selection)

    const annotate = async (process) => {

        if (!selectedLabel && process != 0) {
            setAlertMsg({
                isError: true,
                message: 'Please select label or skip this sentence'
            })
            return
        }

        setSubmittingLoading(true)
        try {
            const url = `http://localhost:3000/annotation/${task.task_id}/annotate`
            const headers = {
                Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            }

            const sentence_id = sentenceToAnnotate.sentence_id
            const label = process === 0 ? 'none' : selectedLabel

            const annotatedCount = await axios.post(url, { sentence_id, label }, { headers: headers })
            setNumOfAnnotatedSentences(annotatedCount.data.annotatedCount)
            setNumOfSkippedSentences(annotatedCount.data.skippedCount)

            setGetNext(prev => prev + 1)

        } catch (error) {
            if (error.status == 401) {
                localStorage.removeItem('ACCESS_TOKEN')
                navigate('/signin', { state: { message: 'Session Expired. Sign in to continue', nextUrl: `viewtask?task_id=${task.task_id}` } })
            }
        }
        setSubmittingLoading(false)
    }
    return (
        <> {
            loading ? <InnerLoader /> :

                <div>
                    <h1 className="text-center text-[18px]">Annotation Task: {task.annotation_type}</h1>
                    <Divider variant='fullWidth'/>

                    <div className="w-full flex flex-row justify-items-center flex-wrap gap-2 mt-10">
                        <h1 className="w-full text-left text-[14px] grow flex items-center p-2 border border-gray-200 rounded-sm">Annotated <h1 className="text-right w-full">{numOfAnnotatedSentences}</h1></h1>
                        <h1 className="w-full text-left text-[14px] grow flex items-center p-2 border border-gray-200 rounded-sm">Skipped <h1 className="text-right w-full">{numOfSkippedSentences}</h1></h1>
                    </div>

                    <div className="p-5 bg-gray-100 mt-3">
                        <h1 className="text-right text-[14px]">{sentenceToAnnotate.sentence_text}</h1>
                    </div>

                    {alertMsg.isError && <Alert sx={{ mt: 2 }} color="error" severity="error">{alertMsg.message}</Alert>}
                    <h1 className="text-[16px] mt-2">Select label:</h1>
                    <RadioButtonGroup labels={task.labels.toLocaleString().split(";")} handleLabelSelection={handleLabelSelection} />

                    <div className="mt-5 flex justify-center gap-5">
                        <Button endIcon={<ArrowForwardIosIcon />} loading={submittingLoading} onClick={annotate} variant='contained' color="success" sx={{ color: 'white', textTransform: 'none', width: '200px' }}>
                            Save & Next
                        </Button>
                        <Button endIcon={<SkipNextIcon />} onClick={() => annotate(0)} variant='outlined' color="error" sx={{ color: 'black', textTransform: 'none', width: '200px' }}>
                            Skip
                        </Button>
                    </div>
                </div>
        }
        </>
    )
}