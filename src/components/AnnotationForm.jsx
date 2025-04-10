import { Button, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import InputText from './InputText';
import InputSelect from './InputSelect';
import InputFile from './InputFile';
import { useTheme } from '@mui/material';
import inputValidators from '../assets/inputValidators';
import axios from 'axios';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useNavigate } from 'react-router-dom';
import { createTheme, styled } from '@mui/material/styles';
import FormHeader from './style_modules/FormHeader';
import { Typography } from '@mui/material';
export default function AnnotationForm() {

    const theme = useTheme()
    const isWideScreen = useMediaQuery(theme.breakpoints.up('lg'))
    const notification = useNotifications()
    const navigate = useNavigate()
    // form data here .. 
    const [fileFormData, setFileFormData] = useState({
        task_name: {
            value: "",
            errorMsg: ""
        },
        annotation_type: {
            value: "",
            errorMsg: ""
        },
        labels: {
            value: "",
            errorMsg: ""
        },
        task_description: {
            value: "",
            errorMsg: ""
        },
        file: {
            values: {
                fileName: "",
                fileSize: "",
                fileData: ""
            },
            errorMsg: ""
        }
    })

    const [loading, setLoading] = useState(false)

    // on each change on the input fields, update the value of its corresponding object in the form data
    const changeHandler = (event) => {
        const { name, value } = event.target
        setFileFormData({ ...fileFormData, [name]: { value: value, errorMsg: "" } })
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
            setFileFormData({ ...fileFormData, [name]: { value: value, errorMsg: errorMsg } })
        }
    }

    // uploaded file handler
    const fileSelectionHandler = (event, isDeleted = false) => {

        if (isDeleted) {
            setFileFormData({
                ...fileFormData, file:
                {
                    values: {
                        fileName: "",
                        fileSize: "",
                        fileData: ""
                    },
                    errorMsg: ''
                }
            })
            return
        }
        event.preventDefault()


        let file = null;

        if (event.dataTransfer) {
            file = event.dataTransfer.files[0];
        }

        else if (event.target.files) {
            file = event.target.files[0];
        }

        if (!file) {
            setFileFormData({
                ...fileFormData, file:
                {
                    values: {
                        fileName: "",
                        fileSize: "",
                        fileData: ""
                    },
                    errorMsg: ''
                }
            })
            return
        }

        const fileName = file.name
        let fileSizeAsString = ''

        // this if statement for create a string to render to the user about file name and size
        if (file.size >= 1024) {
            fileSizeAsString = `${(file.size / 1024).toFixed(2)} KB`
        }
        else {
            fileSizeAsString = `${file.size.toFixed(2)} B`
        }


        setFileFormData({
            ...fileFormData, file:
            {
                values: {
                    fileName: fileName,
                    fileSize: fileSizeAsString,
                    fileData: file
                },
                errorMsg: ''
            }
        })
    }

    const validateBeforeSubmit = () => {
        return inputValidators.validateTaskFormBeforeSubmit(fileFormData, setFileFormData)
    }

    const prepareDataBeforeSubmit = () => {
        const data = { ...fileFormData }
        delete data.file
        data.dataSetFile = fileFormData['file'].values.fileData

        const formData = new FormData()

        for (let field in data) {
            if (field !== "dataSetFile")
                formData.append(field, data[field].value)
            else
                formData.append(field, data[field])
        }
        console.log('FORM DATA: ', formData)
        return formData
    }
    const uploadFile = async () => {

        if (!validateBeforeSubmit()) {
            return
        }

        setLoading(true)
        axios.defaults.withCredentials = true
        const formData = prepareDataBeforeSubmit()
        try {
            const uploadTaskResponse = await axios.post(
                'http://localhost:3000/file/upload',
                prepareDataBeforeSubmit(),
                {
                    headers: {
                        // 'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
                    }
                }
            )
            navigate('/dashboard')
            notification.show('Annotation uploaded successfully', {
                severity: 'success',
                autoHideDuration: 5000
            })
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <div
            style={{
                width: isWideScreen ? '70%' : '100%',
                margin: 'auto',
            }}
        >
            <FormHeader title='Create a new task' />
            <div className="flex flex-column-items padding-8px" >
                <Typography className='text-[20px] dark:text-white'  variant='p'>Task Metadata</Typography>
                <InputText
                    type='text'
                    required
                    title="Task name"
                    name="task_name"
                    id="task name"
                    value={fileFormData.task_name.value}
                    validation_error={fileFormData.task_name.errorMsg}
                    changeHandler={changeHandler}
                    blurHandler={blurHandler}
                />

                <InputSelect
                    required
                    name='annotation_type'
                    value={fileFormData.annotation_type.value}
                    validation_error={fileFormData.annotation_type.errorMsg}
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
                    value={fileFormData.labels.value}
                    validation_error={fileFormData.labels.errorMsg}
                    changeHandler={changeHandler}
                    blurHandler={blurHandler}
                />
                <InputText
                    type='text'
                    title="Description"
                    name="task_description"
                    id="description"
                    placeholder='Description (optional)'
                    value={fileFormData.task_description.value}
                    validation_error={fileFormData.task_description.errorMsg}
                    changeHandler={changeHandler}
                    blurHandler={blurHandler}
                />
            </div>

            <div style={{ backgroundColor: 'inherit' }}>
                <Typography className='text-[20px] dark:text-white' variant='p'>Task Metadata</Typography>
                <h5 className='margin-6px gray-color'>Please upload a file in CSV or XLSX format</h5>
                <InputFile
                    fileSelectionHandler={fileSelectionHandler}
                    validation_error={fileFormData.file.errorMsg}
                />
                {
                    fileFormData.file.values.fileName != "" && <div className="flex flex-column-items padding-8px">
                        <h5 className='center-text margin-6px gray-color'>{fileFormData.file.values.fileName}</h5>
                        <h5 className='center-text margin-6px gray-color'>Size: {fileFormData.file.values.fileSize}</h5>
                    </div>
                }
            </div>

            <div className="margin-30px-top flex flex-centered-items">
                <Button
                    variant='contained'
                    size='small'
                    fullWidth
                    loading={loading}
                    onClick={uploadFile}
                    sx={{
                        textTransform: 'none',
                        width: { lg: '50%', sm: '100%', xs: '100%', xl: '40%' },
                        bgcolor: 'var(--dark-bg)',
                        color: 'white'
                    }}
                >
                    Save Task
                </Button>
            </div>
        </div>
    )
}