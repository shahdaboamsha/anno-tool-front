import { useState } from 'react';
import InputText from '../Inputs/InputText';
import InputSelect from '../Inputs/InputSelect';
import InputFile from '../Inputs/InputFile';
import { Button, IconButton, Tooltip, Alert, Divider } from '@mui/material';
import inputValidators from '../../utils/inputValidators';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import fileLineCounter from '../../utils/fileLinesCounter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DatasetIcon from '@mui/icons-material/Dataset';
import AddBoxIcon from '@mui/icons-material/AddBox';
import clsx from 'clsx';

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
        }
    })

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

        const validation = validateInput(event)
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

            const url = 'http://localhost:3000/file/upload'
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
            const data = prepareDataBeforeSubmit()

            await axios.post(url, data, { headers: headers })
            navigate('/dashboard/taskslist', { state: { message: `Your task ${formData.task_name.value} uploaded successfully` } })

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({ isError: true, message: "Unable to connect to server" })
            }
            else if (error.status === 401) {
                navigate('/signin', { state: { message: "Access Denied" } })
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

            <div className="pt-4 flex flex-col gap-1 sm:w-full lg:w-[500px]">
                <h1 className='text-[18px]'>{<AssignmentIcon sx={{ mr: 1 }} />}Task metadata</h1>
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
                    placeholder='example (positive;pegative)'
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
        </div>
    )
}