import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import RadioButtonGroup from "../../Inputs/RadioButton"
import InnerLoader from "../../Loaders/InnerLoader"
import { Alert, Button, Divider } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ResponseMessage from "../../../utils/ResponsesMessage"
import SessionController from "../../../utils/SessionController"
import SliderCertainity from "../../Inputs/SliderCertainity"
import { set } from "lodash"
axios.defaults.withCredentials = true;

export default function AnnotateForm({ task, updateData }) {

    const navigate = useNavigate()

    const [alertMsg, setAlertMsg] = useState({
        isError: false,
        message: null
    })

    const [sentenceToAnnotate, setSentenceToAnnotate] = useState(null)
    const [certainity, setCertainity] = useState(20)

    const [loading, setLoading] = useState(true)
    const [submittingLoading, setSubmittingLoading] = useState(false)
    const [getNext, setGetNext] = useState(0)
    const [annotateMsg, setAnnotateMsg] = useState(null)

    const [aggreementResult, setAgreementResult] = useState({})
    const [AIAgreement, setAIAgreement] = useState(null)

    const [resultAction, setResultAction] = useState(null)

    const startResolvingDisagreements = async () => {

        const headers = {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
        const url = `${import.meta.env.VITE_API_URL}/assignsample/${task.task_id}/start-resolving`
        await axios.post(
            url,
            { disagreements: sentenceToAnnotate.flaskResponse.disagreements },
            { headers }
        )


        setResultAction(null)
        setGetNext(prev => prev + 1)
        setAgreementResult({})
    }

    const getAIAggreement = async () => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
        const url = `${import.meta.env.VITE_API_URL}/assignsample/${task.task_id}/Ai-human-agreement`

        const aiAggreement = (await axios.get(url, { headers })).data
        console.log("AI Agreement:", aiAggreement)
        setAIAgreement(aiAggreement)
    }

    const actionsFns = {
        "Start Resolving Disagreements": startResolvingDisagreements,
        "Calculate Agreement with AI": getAIAggreement,
    }


    useEffect(() => {

        const getSentenceToAnnotate = async () => {

            setSelectedLabel(null)
            setAlertMsg({ isError: false, message: null })
            setLoading(true)

            try {
                const url = `${import.meta.env.VITE_API_URL}/assignsample/${task.task_id}/next`
                const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

                const nextSentence = (await axios.get(url, { headers: headers })).data
                setSentenceToAnnotate(nextSentence)

                if (nextSentence.message) {
                    setAnnotateMsg(nextSentence.message)
                    if (nextSentence.taskFinished) {
                        setAgreementResult({
                            message: nextSentence.flaskResponse.message,
                            agreement_percentage: nextSentence.flaskResponse.kappa
                        })
                    }
                    if (nextSentence.flaskResponse.disagreements) {
                        setResultAction("Start Resolving Disagreements")
                    }
                    else {
                        setResultAction("Calculate Agreement with AI")
                    }

                }

            } catch (error) {
                if (error.code == "ERR_NETWORK") {
                    setAlertMsg({ isError: true, message: "Unable to connect server" })
                }
                else if (error.status == 401) {
                    const refreshError = await SessionController.refreshToken()
                    if (refreshError instanceof Error) {
                        localStorage.removeItem('ACCESS_TOKEN')
                        navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG, nextUrl: `viewtask?task_id=${task.task_id}` } })
                    }
                    else {
                        await getSentenceToAnnotate()
                    }
                }
                else {
                    setAlertMsg({ isError: true, message: 'Oops! An error occured duting fetching sentence. Try Again' })
                }
            } finally {
                setLoading(false)
            }

        }
        getSentenceToAnnotate()
    }, [task, getNext])


    const [selectedLabel, setSelectedLabel] = useState(null)
    const handleLabelSelection = (selection) => setSelectedLabel(selection)
    const handleCertainitySelection = (cert) => setCertainity(cert)
    const annotate = async (process) => {

        if (!selectedLabel && process !== 0) {
            setAlertMsg({
                isError: true,
                message: 'Please select label or skip this sentence'
            })
            return
        }

        if (process === 0 && annotateMsg) {
            setAlertMsg({ isError: true, message: "You cannot skip this again. Please select a label" })
            return
        }
        setSubmittingLoading(true)
        try {

            const url = `${import.meta.env.VITE_API_URL}/assignsample/${task.task_id}/annotation`
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

            const sentence_id = sentenceToAnnotate.sentence_id
            const label = process === 0 ? 'none' : selectedLabel
            const annotatedCount = await axios.post(url, { sentence_id, label, certainty: certainity }, { headers: headers })
            console.log(annotatedCount.data)

            setGetNext(prev => prev + 1)
            updateData()

        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                setAlertMsg({ isError: true, message: ResponseMessage.ERR_NETWORK_MSG })
            }
            if (error.status == 401) {
                const refreshError = await SessionController.refreshToken()
                if (refreshError instanceof Error) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG, nextUrl: `viewtask?task_id=${task.task_id}` } })
                }
                else {
                    await annotate(process)
                }
            }
            else {
                setAlertMsg({ isError: true, message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG })
            }
        } finally {
            setSubmittingLoading(false)
        }

    }
    return (
        <> {
            loading ? <InnerLoader /> :

                <div className="w-[800px]">
                    <h1 className="text-center text-[18px]">Annotation Task: {task.task_name} - {task.annotation_type}</h1>
                    <Divider variant='fullWidth' />

                    <div className="mt-5 mb-1">
                        {
                            annotateMsg && <Alert severity="info">{!sentenceToAnnotate ? "Completed" : annotateMsg}</Alert>
                        }
                    </div>
                    <div>
                        {
                            aggreementResult.message &&
                            <div className="mt-3">
                                <h1>Aggreement between annotators</h1>
                                <h1 className="text-[14px] text-green-800">Agreement percentage: {aggreementResult.agreement_percentage}</h1>
                                <h1 className="text-[14px] text-green-800">{aggreementResult.message}</h1>
                            </div>
                        }
                        {
                            AIAgreement && AIAgreement.message &&
                            <div className="mt-3">
                                <h1>Aggreement between annotators and AI</h1>
                                <h1 className="text-[14px] text-green-800">Agreement percentage: {AIAgreement.agreement_percentage}</h1>
                                <h1 className="text-[14px] text-green-800">{AIAgreement.message}</h1>
                            </div>
                        }
                    </div>
                    <div className="w-full flex flex-row justify-center flex-wrap gap-2 mt-5">
                        <div className="w-full text-left text-[14px] grow flex items-center p-2 border border-gray-200 rounded-sm">Annotated <h1 className="text-right w-full">{task.annotatedCount}</h1></div>
                        <div className="w-full text-left text-[14px] grow flex items-center p-2 border border-gray-200 rounded-sm">Skipped <h1 className="text-right w-full">{task.skippedCount}</h1></div>
                    </div>

                    {
                        resultAction &&
                        <Button
                            loading={submittingLoading}
                            onClick={actionsFns[resultAction]}
                            fullWidth
                            variant='contained'
                            color="success"
                            sx={{ color: 'white', textTransform: 'none', flexGrow: 1, mt: 2 }}>
                            {resultAction}
                        </Button>
                    }

                    {sentenceToAnnotate && sentenceToAnnotate.sentence_id ?
                        <>
                            <div className="p-5 bg-gray-100 mt-3">
                                <h1 className="text-right text-[14px] arabic">{sentenceToAnnotate.sentence_text}</h1>
                            </div>

                            {alertMsg.isError && <Alert sx={{ mt: 2 }} color="error" severity="error">{alertMsg.message}</Alert>}
                            <h1 className="text-[16px] mt-2">Select label:</h1>
                            <RadioButtonGroup labels={task.labels.toLocaleString().split(";")} handleLabelSelection={handleLabelSelection} />
                            <h1 className="text-[16px] mt-2">Enter certainity:</h1>
                            <SliderCertainity certainity={certainity} setCertainity={handleCertainitySelection} />
                            <div className="mt-5 flex justify-center gap-2">
                                <Button endIcon={<ArrowForwardIosIcon />}
                                    loading={submittingLoading}
                                    onClick={annotate}
                                    fullWidth
                                    variant='contained'
                                    color="success"
                                    sx={{ color: 'white', textTransform: 'none', flexGrow: 1 }}>
                                    Save & Next
                                </Button>
                                <Button fullWidth endIcon={<SkipNextIcon />} onClick={() => annotate(0)} variant='outlined' color="error" sx={{ color: 'black', textTransform: 'none' }}>
                                    Skip
                                </Button>
                            </div>
                        </> : ""
                    }


                </div >
        }
        </>
    )
}