import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import InputText from './InputText';
import InputSelect from './InputSelect';
import InputFile from './InputFile';
import './style_modules/styles.css'
import axios from 'axios';

export default function UploadFileForm() {

    // form data here .. 
    const [fileFormData, setFileFormData] = React.useState({
        taskName: {
            value: "",
            errorMsg: ""
        },
        annotationType: {
            value: "",
            errorMsg: ""
        },
        labels: {
            value: "",
            errorMsg: ""
        },
        description: {
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
    const fileSelectionHandler = (event) => {

        const file = event.target.files[0]

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


    return (
        <div className="flex flex-column-items padding-8px bg-white">
            <div>
                <h3>Task Metadata</h3>
                <InputText
                    type='text'
                    required
                    title="Task name"
                    name="taskName"
                    id="task name"
                    value={fileFormData.taskName.value}
                    validation_error={fileFormData.taskName.errorMsg}
                    changeHandler={changeHandler}
                    blurHandler={blurHandler}
                />

                <InputSelect
                    required
                    name='annotationType'
                    value={fileFormData.annotationType.value}
                    validation_error={fileFormData.annotationType.errorMsg}
                    title="Annotation type"
                    menuItems={["SCI", "CSI", "ISO"]}
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
                    name="description"
                    id="description"
                    placeholder='Description (optional)'
                    value={fileFormData.description.value}
                    validation_error={fileFormData.description.errorMsg}
                    changeHandler={changeHandler}
                    blurHandler={blurHandler}
                />
            </div>

            <div>
                <h3>Upload a dataset file</h3>
                <h5 className='margin-6px gray-color'>Please upload a file in CSV or XLSX format</h5>
                <InputFile
                    fileSelectionHandler={fileSelectionHandler}
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
                    size='large'
                    fullWidth
                    sx={{
                        textTransform: 'none',
                        width: { lg: '50%', sm: '100%', xs: '100%', xl: '40%' },
                        bgcolor: '#ff8fab'
                    }}
                >
                    Save Task
                </Button>
            </div>
        </div>
    )
}
