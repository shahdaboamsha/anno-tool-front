import { useState, useEffect } from "react";
import InputText from '../../components/Inputs/InputText'
import inputValidators from "../../utils/inputValidators";
import { Button, Divider, Alert } from "@mui/material";
import NavigationBar from "../../components/Public/NavigationBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as swalls from '../../components/Public/Swals'
import { useLocation } from "react-router-dom";
export default function ResetPassword() {

    const location = useLocation()
    useEffect(() => {
        localStorage.getItem('ACCESS_TOKEN') ||
            !location.state ||
            !localStorage.getItem('RECOVER_ACCOUNT_TOKEN') ? navigate('/signin') : ""
    }, [])

    const [formData, setFormData] = useState({
        newPassword: {
            value: "",
            errorMsg: null
        },
        confirmNewPassword: {
            value: "",
            errorMsg: null
        }
    })
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [alertMsg, setAlertMsg] = useState({ severity: null, message: null })

    const validateInput = (event) => {
        const { name, value } = event.target

        if (name === "newPassword") {
            return inputValidators.validate("password", value)
        }
        else if (name === "confirmNewPassword") {
            return inputValidators.validate("confirmNewPassword", value, formData.newPassword.value)
        }
    }

    // track the changes over the fields
    const handleChange = (event) => {
        const { name, value } = event.target

        const validation = validateInput(event)
        const errorMsg = validation != 'VALID' ? validation : null
        setFormData({ ...formData, [name]: { value: value, errorMsg: errorMsg } })
    }

    const prepareDataToSubmit = () => {
        return {
            newPassword: formData.newPassword.value,
            confirmPassword: formData.confirmNewPassword.value
        }
    }

    const resetPassword = async () => {

        const isValidData = inputValidators.validate("newPassword", formData.newPassword.value) === 'VALID'
            &&
            inputValidators.validate("confirmNewPassword", formData.confirmNewPassword.value, formData.newPassword.value) === 'VALID'


        if (!isValidData) return

        const data = prepareDataToSubmit()
        setLoading(true)
        try {
            const url = `http://localhost:3000/auth/reset-password`
            const headers = { Authorization: `Bearer ${localStorage.getItem('RECOVER_ACCOUNT_TOKEN')}` }

            await axios.post(url, data, { headers: headers })
            localStorage.removeItem('RECOVER_ACCOUNT_TOKEN')
            swalls.updateAccountInfoSwal("Your password reset successfully")

            setTimeout(() => {
                navigate('/signin')
            }, 2000);

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({ severity: 'error', message: 'Unable to connect with server. Try again' })
            }
            else if (error.status == 401) {
                localStorage.removeItem('RECOVER_ACCOUNT_TOKEN')
                navigate('/signin', { state: { message: 'Access Denied' } })
            }
            else if (error.status == 400) {
                setFormData({ ...formData, currentPassword: { ...formData['currentPassword'], errorMsg: 'Passwords does not matched' } })
            }
            else if (error.status == 404) {
                localStorage.removeItem('RECOVER_ACCOUNT_TOKEN')
                navigate('/signin', { state: { message: 'Access Denied' } })
            }
            else {
                setAlertMsg({ severity: 'error', message: "Oops! An error occured during reset your password process. Try again" })
            }
            setLoading(false)
        }

    }

    return (
        <div className="h-screen flex flex-col items-center justify-start relative gap-5">

            <div style={{ width: '100%', backgroundColor: 'var(--dark-bg)' }}>
                <NavigationBar />
            </div>
            <div className="shadowed text-[14px] mt-5 max-w-[400px]">

                <h1 className="text-[28px] text-center">Set your new password</h1>
                <p className='text-gray-500 text-[14px] text-center mb-2'>Now you can type your new password. Please choose a strong password</p>

                {alertMsg.message && <Alert sx={{ mt: 1 }} severity={alertMsg.severity}>{alertMsg.message}</Alert>}

                <InputText required type="password" title="New password" placeholder="Enter your new password" name="newPassword"
                    id="newPassword"
                    value={formData.newPassword.value}
                    validation_error={formData.newPassword.errorMsg}
                    changeHandler={handleChange}
                />
                <InputText required type="password" title="Re-type password" placeholder="Confirm your new password" name="confirmNewPassword"
                    id="confirmNewPassword"
                    value={formData.confirmNewPassword.value}
                    validation_error={formData.confirmNewPassword.errorMsg}
                    changeHandler={handleChange}
                />
                <Button fu size='small' fullWidth variant="contained" loading={loading} onClick={resetPassword}
                    sx={{ backgroundColor: "var(--dark-bg)", textTransform: 'none', mt: 1, fontWeight: '400' }}
                >Change Password
                </Button>
            </div>
        </div>
    )
}