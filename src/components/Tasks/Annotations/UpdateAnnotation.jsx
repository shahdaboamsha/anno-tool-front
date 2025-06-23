import { useState } from "react";
import { Button, Divider } from "@mui/material";
import RadioButtonGroup from "../../Inputs/RadioButton";
import SaveIcon from '@mui/icons-material/Save';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ResponseMessage from "../../../utils/ResponsesMessage";
import SessionController from "../../../utils/SessionController";
import SliderCertainity from "../../Inputs/SliderCertainity";
axios.defaults.withCredentials = true;

export default function UpdateAnnotation({ annotationDetails, task, notifyChanges, closeDialog }) {

    const navigate = useNavigate()
    const [selectedLabel, setSelectedLabel] = useState(annotationDetails.label)
    const [certainity, setCertainity] = useState(annotationDetails.certainty)
    const [loading, setLoading] = useState(false)

    const handleLabelSelection = (selection) => setSelectedLabel(selection)
    const handleCertainitySelection = (cert) => setCertainity(cert)

    const UpdateAnnotation = async () => {

        try {
            const url = `${import.meta.env.VITE_API_URL}/annotation/updateLabeling`
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
            const body = {
                sentence_id: annotationDetails.sentence_id,
                new_label: selectedLabel,
                task_id: task.task_id,
                certainty: certainity
            }

            console.log(body)
            await axios.post(url, { ...body }, { headers })
            closeDialog()
            notifyChanges({ isError: false, message: "Label updated successfully" })

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                notifyChanges({ isError: true, message: ResponseMessage.ERR_NETWORK_MSG })
            }
            else if (error.status == 401) {
                const refreshError = await SessionController.refreshToken()
                if (refreshError instanceof Error) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG, nextUrl: `viewtask?task_id=${task.task_id}` } })
                }
                else {
                    await UpdateAnnotation()
                }
            }
            else {
                notifyChanges({ isError: true, message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG })
            }

        } finally {
            setLoading(false)

        }
    }
    return (

        <div className="w-[800px]" id="update-annotation">

            <h1 className="text-[14px">Edit your annotation</h1>
            <Divider />
            <div className="p-5 bg-gray-100 mt-3">
                <h1 className="text-right text-[14px] arabic">{annotationDetails.sentence_text}</h1>
            </div>
            <h1 className="text-[16px] mt-2">Select new label:</h1>
            <RadioButtonGroup
                labels={task.labels.toLocaleString().split(";")}
                handleLabelSelection={handleLabelSelection}
                checkedValue={annotationDetails.label}
            />
            <SliderCertainity certainity={certainity} setCertainity={handleCertainitySelection}/>
            <Button endIcon={<SaveIcon />}
                onClick={UpdateAnnotation}
                fullWidth
                variant='contained'
                color="success"
                sx={{ color: 'white', textTransform: 'none', mt: 1 }}
            >
                Save
            </Button>
        </div>
    )
}