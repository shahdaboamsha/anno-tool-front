import { useState } from "react"
import InputText from "./InputText"
import validator from "../assets/inputValidators"
import { Button } from "@mui/material"
import styles from '../components/style_modules/InputText.module.css'
import Alert from '@mui/material/Alert';
import FormHeader from "./FormHeader"

import axios from "axios"

export default function SignupForm() {

    const [formData, setFormData] = useState({
        userName: {
            value: "",
            error: null
        },
        email: {
            value: "",
            error: null
        },
        password: {
            value: "",
            error: null
        },
        confirmPassword: {
            value: "",
            error: null
        },
        dateofbirth: {
            value: "",
            error: null
        },
    })

    const [loading, setLoading] = useState(false)

    const [signupResponse, setResponse] = useState(null)

    // handle the change of the inputs
    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: { value: value, error: null } })
    }

    // handle the blur of the inputs and then show the error messages
    const handleBlur = (event) => {
        const { name, value } = event.target

        let validationResult = null

        if (name === "confirmPassword") {
            validationResult = validator.validate(name, value, formData.password.value)
        }
        else
            validationResult = validator.validate(name, value)

        if (validationResult == "VALID") {
            setFormData({ ...formData, [name]: { value: value, error: null } })
        }
        else {
            setFormData({ ...formData, [name]: { value: value, error: validationResult } })
        }
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
    const signUp = async (event) => {
        event.preventDefault()

        // handle the submission
        if (!validator.validateSignupDataBeforeSubmit(formData, setFormData)) {
            return
        }
        // start button loading
        setLoading(true)

        const userData = prepareDataToSubmit()

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

        // stop button loading 

    }

    return (
        <div>
            {signupResponse &&
                <Alert sx={{ mb: 2 }} severity={signupResponse && !signupResponse.isSuccess ? "error" : "success"} >{signupResponse.message}</Alert>
            }

            <FormHeader title='Sign up' text='Please fill out the fields to create a new account. * fields are required' />
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
                type="password"
                title="Password"
                name="password"
                id="password"
                value={formData.password.value}
                validation_error={formData.password.error}
                changeHandler={handleChange}
                blurHandler={handleBlur}
            />
            <InputText
                required
                type="password"
                title="Confirm password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword.value}
                validation_error={formData.confirmPassword.error}
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

            <div className={`${styles.inputText}`}>
                <Button
                    size='large'
                    loading={loading}
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "var(--dark-bg)", textTransform: 'none', fontWeight: '400' }}
                    onClick={signUp}
                >Sign up
                </Button>
            </div>
            <div className='font-4px mt-5 flex flex-col justify-center items-center text-center'>
                <p>have an account? <a href='/signin' className="text-[14px] text-blue-400 hover:text-blue-800">Sign in</a></p>
            </div>
        </div>
    )
}

