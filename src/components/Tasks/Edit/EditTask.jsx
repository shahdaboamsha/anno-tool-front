import InputText from "../../Inputs/InputText"
import InputSelect from "../../Inputs/InputSelect"
import { useState } from "react";
import { Button, Divider, Alert } from '@mui/material'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import inputValidators from "../../../utils/inputValidators";

export default function EditTask({ initialData }) {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        task_name: {
            value: initialData.task_name,
            errorMsg: ""
        },
        annotation_type: {
            value: initialData.annotation_type,
            errorMsg: ""
        },
        labels: {
            value: initialData.labels.toLocaleString(),
            errorMsg: ""
        },
        task_description: {
            value: initialData.task_description,
            errorMsg: ""
        }
    })
    const [alertMsg, setAlertMsg] = useState({
        isError: false,
        message: null
    })

    const validateInput = (event) => {

        const { name, value, required } = event.target
        if (value === "" || !required)
            return "VALID"

        return inputValidators.validate(name, value)
    }

    // on each change on the input fields, update the value of its corresponding object in the form data
    const changeHandler = (event) => {
        const { name, value } = event.target

        const validation = validateInput(event)
        const errorMsg = validation != 'VALID' ? validation : null

        setFormData({ ...formData, [name]: { value: value, errorMsg: errorMsg } })
    }

    const prepareDataBeforeSubmit = () => {
        const data = { ...formData }

        const dataToSend = {}
        for (let field in data) {
            dataToSend[field] = data[field]['value']
        }
        return dataToSend
    }

    const [loading, setLoading] = useState(false)

    const editTask = async () => {


        if (!inputValidators.validateTaskFormBeforeSubmit(formData, setFormData))
            return

        try {
            setLoading(true)
            const url = `http://localhost:3000/tasks/${initialData.task_id}/updatetask`
            const headers = {
                'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            }

            await axios.post(url, prepareDataBeforeSubmit(), { headers: headers })

            setAlertMsg({ isError: false, message: "Task updated successfully" })

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({ isError: true, message: 'Unable to connect to server' })
            }
            else if (error.response.status === 401) {
                localStorage.removeItem('ACCESS_TOKEN')
                navigate('/signin', { state: { message: "Access Denied" } })
            }
            else {
                setAlertMsg({ isError: true, message: 'Oops, an error occured during the process, please try again' })
            }
        }
        setLoading(false)
    }
    return (
        <div className="flex flex-col w-[400px] gap-1">
            <h1 className='text-[18px] mt-3'>Edit your task metadata</h1>
            <Divider />
            <p className='text-gray-500 text-[14px]'>You can edit your task information. File and sentences cannot be editted</p>

            {alertMsg.message ? <Alert sx={{ mb: 2 }} severity={alertMsg.isError ? 'error' : 'success'}>{alertMsg.message}</Alert> : ""}

            <InputText required type='text' title="Task name" name="task_name" id="task name"
                value={formData.task_name.value}
                validation_error={formData.task_name.errorMsg}
                changeHandler={changeHandler}
            />

            <InputSelect required name='annotation_type' title="Annotation type"
                value={formData.annotation_type.value}
                validation_error={formData.annotation_type.errorMsg}
                menuItems={["Sentiment", "Sarcasm", "Stennce"]}
                changeHandler={changeHandler}
            />

            <InputText required type='text' title="Labels" name="labels" id="labels"
                placeholder='Labels comma seperated (,)'
                value={formData.labels.value}
                validation_error={formData.labels.errorMsg}
                changeHandler={changeHandler}
            />
            <InputText type='text' title="Description" name="task_description" id="description"
                placeholder='Description (optional)'
                value={formData.task_description.value}
                validation_error={formData.task_description.errorMsg}
                changeHandler={changeHandler}
            />
            <Button fullWidth variant='contained' size='small'
                loading={loading}
                sx={{ textTransform: 'none', bgcolor: 'var(--dark-bg)', mt: 1}}
                onClick={editTask}
            >
                Save
            </Button>

        </div>

    )
}