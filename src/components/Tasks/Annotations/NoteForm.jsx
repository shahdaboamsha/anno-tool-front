import { useState } from "react";
import InputText from "../../Inputs/InputText";
import { useOutletContext } from "react-router-dom";
import { Button, Alert, Divider } from "@mui/material";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import ResponseMessage from "../../../utils/ResponsesMessage";
import SessionController from "../../../utils/SessionController";
import SingleAnnotationDetails from "./SingleAnnotaionDetails";
axios.defaults.withCredentials = true;

export default function NoteForm({ notifyChanges, closeDialog, annotationDetails }) {

    const navigate = useNavigate()
    const { userData } = useOutletContext()
    // text, userId, sentenceId, sentenceText, label

    const [note, setNote] = useState("")

    const [loading, setLoading] = useState(false)

    const [alertMsg, setAlertMsg] = useState({
        isError: false,
        message: null
    })

    const handleChange = (e) => {
        setNote(e.target.value)
    }
    const sendNote = async () => {

        if (note.trim() == "") {
            setAlertMsg({ ...alertMsg, isError: true, message: "Note field cannot be empty" })
            document.getElementById('note').focus()
            return
        }
        setLoading(true)
        try {

            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
            await axios.post(`${import.meta.env.VITE_API_URL}/notes/addnotes`, {
                text: note,
                userId: annotationDetails.user_id,
                label: annotationDetails.label,
                sentenceText: annotationDetails.sentence_text,
                sentenceId: annotationDetails.sentence_id

            }, { headers })
            setAlertMsg({ isError: false, message: "Note sent successfully" })
            // closeDialog()

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({ isError: true, message: ResponseMessage.ERR_NETWORK_MSG })
            }
            else if (error.status == 401) {
                const refreshError = await SessionController.refreshToken()
                if (refreshError instanceof Error) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG, nextUrl: `viewtask?task_id=${note.taskId}` } })
                }
                else {
                    sendNote()
                }
            }
            else {
                setAlertMsg({ isError: true, message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG })
            }
        } finally {
            setLoading(false)
            setTimeout(() => {
                setAlertMsg({ isError: false, message: null })
            }, 3000);
        }


    }
    const formatDateToLong = (dateString) => {
        const date = new Date(dateString)
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date)
    }
    return (
        <div className="w-[600px]">
            <h1 >Annotation details - {annotationDetails.label}</h1>
            <Divider variant='fullWidth' />
            <table className="table-fixed text-[14px]">
                <tbody>
                    <tr>
                        <th className="text-left p-2 font-semibold">Annotated At</th>
                        <td className="p-2">{formatDateToLong(annotationDetails.created_at)}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Annotator ID</th>
                        <td className="p-2">{annotationDetails.user_id}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Annotator name</th>
                        <td className="p-2">{annotationDetails.user_name}</td>
                    </tr>
                    <tr>
                        <th className="text-left font-semibold p-2">Sentence ID</th>
                        <td className="p-2">{annotationDetails.sentence_id}</td>
                    </tr>
                    <tr>
                        <th className="text-left font-semibold p-2">Sentence</th>
                        <td className="p-2 arabic  bg-gray-100">{annotationDetails.sentence_text}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Label</th>
                        <td className="p-2">{annotationDetails.label}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Certainty</th>
                        <td className="p-2">{annotationDetails.certainty}</td>
                    </tr>
                </tbody>
            </table>

            <Divider />
            <h1 className="text-[14px] mt-5 mb-1">You can send a note to {annotationDetails.user_name} for this annotation</h1>
            <InputText name="note" title="Note" value={note.text} id='note'
                placeholder={`Enter a note to send to ${annotationDetails.user_name}`}
                validation_error={null}
                changeHandler={handleChange}
                widthDetection={false}
            />
            {alertMsg.message && <Alert severity={alertMsg.isError ? "error" : "success"}>{alertMsg.message}</Alert>}

            <Button variant='contained' size='small' fullWidth
                loading={loading}
                onClick={sendNote}
                sx={{ textTransform: 'none', bgcolor: 'var(--dark-bg)', mt: 1 }}
            >
                Send note
            </Button>
        </div>

    )

}
