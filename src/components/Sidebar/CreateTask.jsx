import { useState } from 'react';
import InputText from '../Inputs/InputText';
import InputSelect from '../Inputs/InputSelect';
import InputFile from '../Inputs/InputFile';
import { Button, IconButton, Tooltip, Alert, Divider } from '@mui/material';
import inputValidators from '../../utils/inputValidators';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import fileLineCounter from '../../utils/fileLinesCounter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DatasetIcon from '@mui/icons-material/Dataset';
import AddBoxIcon from '@mui/icons-material/AddBox';
import xlsxHelpScreenshot from '../../assets/xlsx_preview.png'
import appData from '../../utils/appData.json'
import SessionController from '../../utils/SessionController';
const annotationLabels = (annotationName) => appData.annotationTypes.filter(annotationType => annotationType.annotationName === annotationName)[0]
const annotationsNames = appData.annotationTypes.map(annotationType => annotationType.annotationName)

export default function CreateTask() {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
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
                fileData: "",
                lines: null
            },
            errorMsg: ""
        },
        deadline: {
            value: 10,
            errorMsg: ""
        }
    })

    const calculateDeadlineDate = (deadline) => {

        if (isNaN(deadline) || deadline === '') return ''

        const today = new Date()
        const newDate = new Date(today)
        newDate.setDate(today.getDate() + parseInt(deadline))

        const day = String(newDate.getDate()).padStart(2, '0')
        const month = String(newDate.getMonth() + 1).padStart(2, '0')
        const year = newDate.getFullYear()

        return `${day}/${month}/${year}`
    }

    const [deadlineMsg, setDeadlineMsg] = useState(`This task will expired on ${calculateDeadlineDate(formData.deadline.value)}`)
    const [loading, setLoading] = useState(false)
    const [fileChangedAtLeastOnce, setFileChangedAtLeastOnce] = useState(false)
    const [alertMsg, setAlertMsg] = useState({ isError: false, message: null })

    const validateInput = (event) => {

        const { name, value, required } = event.target
        if (value === "" || !required)
            return "VALID"

        return inputValidators.validate(name, value)
    }

    // on each change on the input fields, update the value of its corresponding object in the form data
    const changeHandler = (event) => {
        const { name, value } = event.target
        if (name === 'annotation_type') {
            const selectedTaskLabels = annotationLabels(value).labels.toString()
            setFormData({
                ...formData,
                labels: { value: selectedTaskLabels, errorMsg: null },
                annotation_type: { value: value, errorMsg: null }
            })
            return
        }

        const validation = validateInput(event)
        if (name === "deadline") {
            if (value == "") {
                setDeadlineMsg("")
            }
            else setDeadlineMsg(`This task will expired on ${calculateDeadlineDate(value)}`)
        }

        const errorMsg = validation != 'VALID' ? validation : null

        setFormData({ ...formData, [name]: { value: value, errorMsg: errorMsg } })
    }

    // uploaded file handler
    const fileSelectionHandler = async (event, isDeleted = false) => {

        setFileChangedAtLeastOnce(true)

        if (isDeleted) {
            setFileChangedAtLeastOnce(false)
            setFormData({
                ...formData, file:
                {
                    values: {
                        fileName: "",
                        fileSize: "",
                        fileData: "",
                        lines: null
                    },
                    errorMsg: ''
                }
            })
            return
        }

        let file = null;

        if (event.dataTransfer) {
            file = event.dataTransfer.files[0];
        }

        else if (event.target.files) {
            file = event.target.files[0]
        }

        const fileName = file.name
        let fileSizeAsString = ''
        const lines = await fileLineCounter(file, fileName)

        // this if statement for create a string to render to the user about file name and size
        if (file.size >= 1024) {
            fileSizeAsString = `${(file.size / 1024).toFixed(2)} KB`
        }
        else {
            fileSizeAsString = `${file.size.toFixed(2)} B`
        }

        setFormData({
            ...formData, file:
            {
                values: {
                    fileName: fileName,
                    fileSize: fileSizeAsString,
                    fileData: file,
                    lines: lines
                },
                errorMsg: ''
            }
        })
    }

    // prepare data as key/value not key : {value, errorMsg}
    const prepareDataBeforeSubmit = () => {
        const data = { ...formData }
        delete data.file

        const dataToSend = new FormData()
        for (let field in data) {
            dataToSend.append(field, data[field].value)
        }
        dataToSend.append('dataSetFile', formData['file'].values.fileData)
        return dataToSend
    }



    const uploadTask = async () => {

        if (!inputValidators.validateTaskFormBeforeSubmit(formData, setFormData))
            return

        setLoading(true)
        try {

            const url = `${import.meta.env.VITE_API_URL}/file/upload`
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
            const data = prepareDataBeforeSubmit()

            await axios.post(url, data, { headers: headers })
            navigate('/dashboard/taskslist', { state: { message: `Your task ${formData.task_name.value} uploaded successfully` } })

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({ isError: true, message: "Unable to connect to server" })
            }
            else if (error.status === 401) {
                const refreshError = await SessionController.refreshToken()
                if (refreshError instanceof Error) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: "Session expired, please sign in again" } })
                }
                else await uploadTask()
            }
            else if (error.status === 400) {
                setAlertMsg({ isError: true, message: error.response.data.message })
            }
            else {
                setAlertMsg({ isError: true, message: "Oops! An error occured during the process. Try again" })
            }
        }
        setLoading(false)
    }

    return (
        <div className='flex flex-col p-10' >
            <h1 className='text-[28px]'> <AddBoxIcon /> Create a new task</h1>
            <Divider />
            <p className='text-gray-500 text-[14px]'>Create your new annotation task by filling out the task metadata fields. Attach the task with a dataset file</p>
            {alertMsg.isError ? <Alert severity='error' id='alert'>{alertMsg.message}</Alert> : ''}

            <div className="flex flex-row gap-8 justify-between flex-wrap-reverse">
                <div className="pt-4 flex flex-col gap-1  sm:w-full lg:w-[500px]">
                    <h1 className='text-[18px]'>{<AssignmentIcon sx={{ mr: 1 }} />}Task metadata</h1>
                    <InputText required type='text' title="Task name" name="task_name" id="task name"
                        value={formData.task_name.value}
                        validation_error={formData.task_name.errorMsg}
                        changeHandler={changeHandler}
                    />

                    <InputSelect required name='annotation_type' title="Annotation type"
                        value={formData.annotation_type.value}
                        validation_error={formData.annotation_type.errorMsg}
                        menuItems={annotationsNames}
                        changeHandler={changeHandler}
                    />

                    <InputText required type='text' title="Labels" name="labels" id="labels"
                        placeholder='example (positive;negative)'
                        value={formData.labels.value}
                        validation_error={formData.labels.errorMsg}
                        changeHandler={changeHandler}
                    />



                    <InputText required type='number' title="Deadline" name="deadline" id="description"
                        placeholder='Enter number of days'
                        value={formData.deadline.value}
                        validation_error={formData.deadline.errorMsg}
                        changeHandler={changeHandler}
                        widthDetection={true}
                    />
                    <h1 className='text-[14px]'>{deadlineMsg}</h1>

                    <InputText type='text' title="Description" name="task_description" id="description"
                        placeholder='Description (optional)'
                        value={formData.task_description.value}
                        validation_error={formData.task_description.errorMsg}
                        changeHandler={changeHandler}
                        widthDetection={false}
                    />
                    <h1 className='text-[18px] mt-4 text-left'>{<DatasetIcon sx={{ mr: 1 }} />}Task dataset</h1>
                    <div style={{ display: fileChangedAtLeastOnce ? 'none' : 'block' }}>
                        <h1 className='text-gray-500 text-[14px]'>Please upload a file in CSV or XLSX format</h1>
                        <InputFile
                            fileSelectionHandler={fileSelectionHandler}
                            validation_error={formData.file.errorMsg}
                        />
                    </div>

                    {
                        formData.file.values.fileName != "" &&
                        <table className="text-sm text-left rtl:text-right">
                            <thead className="text-xs text-white bg-black" style={{ backgroundColor: 'var(--dark-bg)' }}>
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        File name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        File size
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Number of lines
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td scope="row" className="px-6 py-4">
                                        {formData.file.values.fileName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formData.file.values.fileSize}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formData.file.values.lines}
                                    </td>

                                    <td className="px-6 py-4">
                                        <Tooltip title='Delete file'>
                                            <IconButton onClick={(e) => fileSelectionHandler(null, true)}>
                                                <DeleteIcon color='error' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Choose another file'>
                                            <IconButton onClick={(e) => document.getElementById('dataInput')?.click()}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    }
                    <Button variant='contained' size='small' fullWidth
                        loading={loading}
                        onClick={uploadTask}
                        sx={{ textTransform: 'none', bgcolor: 'var(--dark-bg)', mt: 1 }}
                    >
                        Save Task
                    </Button>
                </div>

                <div className="pt-4 help-img max-w-md grow">
                    <p className="text-[14px] mb-1 font-bold">
                        Make sure your file has the correct column structure, as shown below:
                    </p>

                    <p className="text-[14px] font-semibold mb-1">File preview:</p>
                    <img src={xlsxHelpScreenshot} alt="XLSX TEMPLATE" className=" rounded shadow-sm" />

                    <p className="text-[14px] mt-3">
                        The header must include <strong>ID</strong> and <strong>Text</strong> (or a similar word like <strong>Sentence</strong>, <strong>Field</strong>, or <strong>Content</strong>).
                    </p>

                    <p className="text-[14px] mt-2">
                        Don’t worry about adding a <strong>Label</strong> column — we’ll take care of that automatically.
                    </p>

                    <div className="mt-4 space-y-2">
                        <p className="text-[14px] font-bold">
                            <a
                                className="text-blue-500 hover:text-blue-400 underline cursor-pointer"
                                href="/xlsx_template.xlsx"
                                download
                            >
                                📥 Download Excel Template
                            </a>
                        </p>
                        <p className="text-[14px] font-bold">
                            <a
                                className="text-blue-500 hover:text-blue-400 underline cursor-pointer"
                                href="/csv_template.csv"
                                download
                            >
                                📥 Download CSV Template
                            </a>
                        </p>
                    </div>
                </div>

            </div>

        </div>
    )
}