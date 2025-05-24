import { useState } from "react";
import InputText from "../../Inputs/InputText";
import { useOutletContext } from "react-router-dom";
import { Button, Alert } from "@mui/material";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import ResponseMessage from "../../../utils/ResponsesMessage";

export default function NoteForm({ note, handleChange, notifyChanges, closeDialog }) {

    const navigate = useNavigate()
    const { userData } = useOutletContext()
    const [loading, setLoading] = useState(false)

    const [alertMsg, setAlertMsg] = useState({
        isError: false,
        message: null
    })

    const sendNote = async () => {

        if (note.text.trim() == "") {
            setAlertMsg({ ...alertMsg, isError: true, message: "Please provide a note" })
            document.getElementById('note').focus()
            return
        }
        setLoading(true)
        try {

            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
            await axios.post(`${import.meta.env.VITE_API_URL}/notes/addnotes`, note, { headers })
           // closeDialog()

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                    setAlertMsg({ isError: true, message: ResponseMessage.ERR_NETWORK_MSG })
                }
                else if (error.status == 401) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG, nextUrl: `viewtask?task_id=${task.task_id}` } })
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

    return (
        <div className="w-[600px]">
            {alertMsg.message && <Alert severity={alertMsg.isError ? "error" : "success"}>{alertMsg.message}</Alert>}
            <table className="table-fixed text-[14px]">
                <tbody>

                    <tr>
                        <th className="text-left p-2 ">From</th>
                        <td className="p-2">{userData.userName} (You)</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">To</th>
                        <td className="p-2">{note.userName}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Sentence</th>
                        <td className="p-2">{note.sentenceText}</td>
                    </tr>
                    <tr>
                        <th className="text-left p-2 font-semibold">Label</th>
                        <td className="p-2">{note.label}</td>
                    </tr>
                </tbody>
            </table>

            <InputText name="note" title="Note" value={note.text} id='note'
                placeholder="Write a note about this annotation"
                validation_error={null}
                changeHandler={handleChange}
                widthDetection={false}
            />

            <Button variant='contained' size='small' fullWidth 
                loading={loading}
                onClick={sendNote}
                sx={{ textTransform: 'none', bgcolor: 'var(--dark-bg)', mt: 1 }}
            >
                Add note
            </Button>
        </div>

    )

}
