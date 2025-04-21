import { useState } from "react";
import InputText from "./InputText";
import inputValidators from "../assets/inputValidators";
import { Button, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

export default function UserAccountSettings() {

    const navigate = useNavigate()
    const userData = {
        userName: "Ghassan Amous",
        email: "shahd@gmail.com",
        dateofbirth: "2002-10-17 00:00:00"
    }

    const [formData, setFormData] = useState({
        userName: {
            value: userData.userName,
            error: null
        },
        email: {
            value: userData.email,
            error: null
        },
        dateofbirth: {
            value: userData.dateofbirth.split(" ")[0],
            error: null
        }
    })

    const [loading, setLoading] = useState(false)
    // handle the change of the inputs
    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: { value: value, error: null } })
    }

    // handle the blur of the inputs and then show the error messages
    const handleBlur = (event) => {
        const { name, value } = event.target

        let validationResult = null

        validationResult = inputValidators.validate(name, value)

        if (validationResult == "VALID") {
            setFormData({ ...formData, [name]: { value: value, error: null } })
        }
        else {
            setFormData({ ...formData, [name]: { value: value, error: validationResult } })
        }
    }

    const prepareDataToSubmit = () => {
        const dataToSubmit = {}
        for (const key in formData) {
            dataToSubmit[key] = formData[key]['value']
        }

        return dataToSubmit
    }

    const editMyData = async (event) => {
        event.preventDefault()

        // handle the submission
        if (!inputValidators.validateSignupDataBeforeSubmit(formData, setFormData)) {
            return
        }
        // start button loading
        // setLoading(true)

        const userData = prepareDataToSubmit()
        console.log(userData)
        /*
        // 2. make a request (send to api...)
        axios.defaults.withCredentials = true

        try {
            await axios.post('http://localhost:3000/auth/register', userData)

            setResponse({
                message: "User Registered successfully",
                isSuccess: true
            })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            if (error.code == "ERR_NETWORK") {
                setResponse({
                    message: "Oops! Could not connect to the server. Please try again later.",
                    isSuccess: false
                })
            }
            else {
                const { data } = error.response
                setResponse({ message: data.ErrorMsg, isSuccess: false })

                if (error.status === 409 || error.status === 422) {
                    for (let ErrorField in data.ErrorFields) {
                        setFormData({
                            ...formData,
                            [ErrorField]: {
                                value: formData[ErrorField].value,
                                error: data.ErrorFields[ErrorField]
                            }
                        })
                    }
                }
            }
        }
*/
        // stop button loading 

    }

    return (
        <div className="flex flex-col p-10">
            <h1 className="text-[18px]"> <EditIcon /> Edit your account infotmation</h1>
            <Divider />
            <div className="mt-5 flex flex-col items-center justify-center gap-1 sm:w-full lg:w-[500px]">
                <InputText
                    required
                    type="text"
                    title="Your name"
                    name="userName"
                    id="userName"
                    value={formData.userName.value}
                    validation_error={formData.userName.error}
                    changeHandler={handleChange}
                    blurHandler={handleBlur}
                />
                <InputText
                    required
                    type="email"
                    title="Email"
                    name="email"
                    id="email"
                    value={formData.email.value}
                    validation_error={formData.email.error}
                    changeHandler={handleChange}
                    blurHandler={handleBlur}
                />
                <InputText
                    required
                    type="date"
                    title="Date of Birth"
                    name="dateofbirth"
                    id="Date of Birth"
                    value={formData.dateofbirth.value}
                    validation_error={formData.dateofbirth.error}
                    changeHandler={handleChange}
                    blurHandler={handleBlur}
                />
                <Button
                    size='large'
                    onClick={editMyData}
                    loading={loading}
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "var(--dark-bg)", textTransform: 'none', color: 'white', fontWeight: '400' }}
                >Save
                </Button>


            </div>
            <div className='mt-2 p-2 flex flex-row justify-start items-start'>
                <h1 className="text text-[14px] mt-1">Need to change your password? <a className="text-[14px] text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => navigate('../security')} >Change password</a></h1>
            </div>
        </div>
    )
}