import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RadioButtonGroup from "../RadioButton"
import InnerLoader from "../InnerLoader"
import { Alert, Button } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function AnnotateForm({ task, numberOfSentences }) {
    const navigate = useNavigate()
    const [alertMsg, setAlertMsg] = useState({
        isError: false,
        message: null
    })
    const [sentenceToAnnotate, setSentenceToAnnotate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submittinLoading, setSubmittingLoading] = useState(false)
    const [getNext, setGetNext] = useState(0)
    const [numOfAnnotatedSentences, setNumOfAnnotatedSentences] = useState(0)

    useEffect(() => {

        const getSentenceToAnnotate = async () => {
            setSelectedLabel(null)
            setAlertMsg({isError: false, message: null})
            setLoading(true)
            try {
                const url = `http://localhost:3000/tasks/${task.task_id}/sentences/unannotated`
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
                }

                const sentenceToAnnotate = (await axios.get(url, { headers: headers })).data
                setSentenceToAnnotate(sentenceToAnnotate)
            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    setAlertMsg({ isError: true, message: "Unable to connect server" })
                }
                else if (error.status == 401) {
                    navigate('/signin', { state: { message: 'Session Expired. Sign in to continue' } })
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

    const handleSelection = (selection) => setSelectedLabel(selection)


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
            const label = process === 0 ? 'None' : selectedLabel

            const annotationResult = await axios.post(url, { sentence_id, label }, { headers: headers })

            if (process != 0){
                setNumOfAnnotatedSentences(prev => prev+1)
            }
            
            setGetNext(prev => prev + 1)

        } catch (error) {
            if (error.status == 401){
                navigate('/signin', {state: {message: 'Session Expired. Sign in to continue'}})
            }
        }
        setSubmittingLoading(false)
    }
    return (
        <>{
            loading ? <InnerLoader /> :

                <div>
                    <h1 className="text-left text-[18px]">Annotation Task: {task.task_name}</h1>

                    <h1 className="text-right text-[14px]">Porgess: {task.completed_by_user}/{numberOfSentences}</h1>
                    <div className="p-5 bg-gray-100">
                        <h1 className="text-right text-[14px]">{sentenceToAnnotate.sentence_text}</h1>
                    </div>
                    {alertMsg.isError && <Alert sx={{mt: 2}} color="error" severity="error">{alertMsg.message}</Alert>}
                    <RadioButtonGroup labels={task.labels.toLocaleString().split(";")} handleLabelSelection={handleSelection} />

                    <div className="mt-5 flex justify-center gap-5">
                        <Button endIcon={<ArrowForwardIosIcon/>} loading={submittinLoading} onClick={annotate} variant='contained' color="success" sx={{ color: 'white', textTransform: 'none', width: '200px' }}>
                            Save & Next
                        </Button>
                        <Button endIcon={<SkipNextIcon/>} onClick={() => annotate(0)} variant='outlined' color="error" sx={{ color: 'black', textTransform: 'none', width: '200px' }}>
                            Skip
                        </Button>
                    </div>
                </div>
        }
        </>
    )
}