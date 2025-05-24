import { useState } from "react"
import InputText from "../Inputs/InputText"
import InputDate from "../Inputs/InputDate"
import validator from "../../utils/inputValidators"
import { Button, Alert } from "@mui/material"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import ResponseMessage from "../../utils/ResponsesMessage"

export default function SignupForm() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        userName: {
            value: "",
            errorMsg: null
        },
        email: {
            value: "",
            errorMsg: null
        },
        password: {
            value: "",
            errorMsg: null
        },
        confirmPassword: {
            value: "",
            errorMsg: null
        },
        dateofbirth: {
            value: "",
            errorMsg: null
        },
    })

    const [loading, setLoading] = useState(false)
    const [alertMsg, setAlertMsg] = useState({
        isError: false,
        message: null
    })

    // is the changes is valid data?
    const validateInput = (event) => {

        const { name, value, required } = event.target
        if (value === "" || !required)
            return "VALID"

        let validationResult = null

        if (name === "confirmPassword")
            return validationResult = validator.validate(name, value, formData.password.value)
        else
            return validationResult = validator.validate(name, value)
    }
    // handle the change of the inputs
    const handleChange = (event) => {
        const { name, value } = event.target

        const validation = validateInput(event)
        const errorMsg = validation != 'VALID' ? validation : null

        setFormData({ ...formData, [name]: { value: value, errorMsg: errorMsg } })
    }


    // This method is for preparing the data as key/value to transfer to the server over POST HTTP method request
    const prepareDataToSubmit = () => {

        const dataToSubmit = {}

        for (const key in formData) {
            dataToSubmit[key] = formData[key]['value']
        }
        return dataToSubmit
    }

    // This function is for real signing up by connect to server over post method request  
    const signUp = async () => {

        if (!validator.validateSignupDataBeforeSubmit(formData, setFormData)) {
            return
        }
        const userData = prepareDataToSubmit()
        setLoading(true)

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData)
            navigate('/signin', { state: { notError: true, message: "You successfully registerd. Sign into you account" } })

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({
                    message: ResponseMessage.ERR_NETWORK_MSG,
                    isError: true
                })
            }
            else if (error.status === 409 || error.status === 422) {
                setAlertMsg({ isError: true, message: "Please enter a correct and valid data" })
                const { data } = error.response
                for (let ErrorField in data.ErrorFields) {
                    setFormData({
                        ...formData,
                        [ErrorField]: {
                            value: formData[ErrorField].value,
                            errorMsg: data.ErrorFields[ErrorField]
                        }
                    })
                }
            } else {
                setAlertMsg({
                    isError: true,
                    message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG
                })
            }
        } finally {
            setLoading(false)
        }


    }
    return (
        <div className="flex flex-col gap-1 min-w-[350px]">
            <h1 className='text-[28px] text-center'>Sign up</h1>
            <p className='text-gray-500 text-[14px] text-center'>Please fill out the fields to create a new account. * fields are required</p>
            {alertMsg.isError && <Alert sx={{ mb: 2 }} severity='error'>{alertMsg.message}</Alert>}

            <InputText autoFocus required type="text" title="Your name" name="userName" id="userName"
                value={formData.userName.value}
                validation_error={formData.userName.errorMsg}
                changeHandler={handleChange}
            />
            <InputText required type="email" title="Email" name="email" id="email"
                value={formData.email.value}
                validation_error={formData.email.errorMsg}
                changeHandler={handleChange}
            />
            <InputText required type="password" title="Password" name="password" id="password"
                value={formData.password.value}
                validation_error={formData.password.errorMsg}
                changeHandler={handleChange}
            />
            <InputText required type="password" title="Confirm password" name="confirmPassword" id="confirmPassword"
                value={formData.confirmPassword.value}
                validation_error={formData.confirmPassword.errorMsg}
                changeHandler={handleChange}
            />
            <InputDate name='dateofbirth' title="Date of Birth" placeholder='Date of Birth'
                value={formData.dateofbirth.value}
                validation_error={formData.dateofbirth.errorMsg}
                changeHandler={handleChange}
            />

            <Button size='small' fullWidth variant="contained"
                loading={loading}
                sx={{ mt: 1, backgroundColor: "var(--dark-bg)", textTransform: 'none', color: 'white', fontWeight: '400' }}
                onClick={signUp}
            >Sign up </Button>

            <p className="text-[14px] text-center mt-2">have an account? <a href='/signin' className="text-blue-400 hover:text-blue-800">Sign in</a></p>
        </div>
    )
}

