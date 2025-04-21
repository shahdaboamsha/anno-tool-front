import InputText from "../InputText"
import InputSelect from "../InputSelect"
import { useState, useEffect, useMemo } from "react";
import { Button, Divider, Alert } from '@mui/material'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import inputValidators from "../../assets/inputValidators";

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

    const changeHandler = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: { value: value, errorMsg: "" } })
    }

    // when a blur event happen to any input field, this function will be triggered, updating the error message of the field
    const blurHandler = (event, title, required = false) => {
        const { name, value } = event.target

        if (!required) {
            return
        }

        if (value.trim() == "") {
            let errorMsg = ""
            errorMsg = `${title} is required`
            setFormData({ ...formData, [name]: { value: value, errorMsg: errorMsg } })
        }
    }

    const validateBeforeSubmit = () => inputValidators.validateTaskFormBeforeSubmit(formData, setFormData)

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


        if (!validateBeforeSubmit()) {
            setAlertMsg({ isError: true, message: "Please enter a valid data" })
            return
        }

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
        <div className="flex flex-col w-[400px]">
            <h1 className='text-[18px] mt-3 text-center'>Edit your task metadata</h1>
            <Divider sx={{ mb: 3 }} />
            {alertMsg.message ? <Alert sx={{ mb: 2 }} severity={alertMsg.isError ? 'error' : 'success'}>{alertMsg.message}</Alert> : ""}

            <InputText
                type='text'
                required
                title="Task name"
                name="task_name"
                id="task name"
                value={formData.task_name.value}
                validation_error={formData.task_name.errorMsg}
                changeHandler={changeHandler}
                blurHandler={blurHandler}
            />

            <InputSelect
                required
                name='annotation_type'
                value={formData.annotation_type.value}
                validation_error={formData.annotation_type.errorMsg}
                title="Annotation type"
                menuItems={["Sentiment", "Sarcasm", "Stennce"]}
                changeHandler={changeHandler}
                blurHandler={blurHandler}
            />

            <InputText
                type='text'
                required
                title="Labels"
                name="labels"
                id="labels"
                placeholder='Labels comma seperated (,)'
                value={formData.labels.value}
                validation_error={formData.labels.errorMsg}
                changeHandler={changeHandler}
                blurHandler={blurHandler}
            />
            <InputText
                type='text'
                title="Description"
                name="task_description"
                id="description"
                placeholder='Description (optional)'
                value={formData.task_description.value}
                validation_error={formData.task_description.errorMsg}
                changeHandler={changeHandler}
                blurHandler={blurHandler}
            />
            <Button
                variant='contained'
                size='small'
                loading={loading}
                fullWidth
                sx={{
                    textTransform: 'none',
                    bgcolor: 'var(--dark-bg)',
                    color: 'white',
                }}
                onClick={editTask}
            >
                Save
            </Button>

        </div>

    )
}