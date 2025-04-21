import { useState } from "react";
import InputText from "./InputText";
import inputValidators from "../assets/inputValidators";
import { Button, Divider } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';

export default function UserAccountSecurity() {

    const [formData, setFormData] = useState({
        password: {
            value: "",
            error: null
        },
        confirmPassword: {
            value: "",
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
    
            if (name === "confirmPassword") {
                validationResult = inputValidators.validate(name, value, formData.password.value)
            }
            else
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

    const changePassword = async (event) => {
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
            <h1 className="text-[18px]"> <LockIcon/> Edit your account password</h1>
            <Divider />
            <div className="mt-5 flex flex-col items-center justify-center gap-1 sm:w-full lg:w-[500px]">
                <InputText
                    required
                    type="password"
                    title="New password"
                    placeholder="Enter your new password"
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
                    title="Re-type password"
                    placeholder="Confirm your new password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword.value}
                    validation_error={formData.confirmPassword.error}
                    changeHandler={handleChange}
                    blurHandler={handleBlur}
                />
                <Button
                    size='large'
                    onClick={changePassword}
                    loading={loading}
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "var(--dark-bg)", textTransform: 'none', color: 'white', fontWeight: '400' }}
                >Save
                </Button>
            </div>
        </div>
    )
}