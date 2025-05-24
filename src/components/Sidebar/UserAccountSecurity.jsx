import { useState } from "react";
import InputText from "../Inputs/InputText";
import inputValidators from "../../utils/inputValidators";
import { Button, Divider, Alert } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as swalls from '../Public/Swals'

export default function UserAccountSecurity() {

    const [formData, setFormData] = useState({
        currentPassword: {
            value: "",
            errorMsg: ""
        },
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
            current_password: formData.currentPassword.value,
            new_password: formData.newPassword.value
        }
    }

    const changePassword = async () => {


        const isValidData = inputValidators.validate("newPassword", formData.newPassword.value) === 'VALID'
            &&
            inputValidators.validate("confirmNewPassword", formData.confirmNewPassword.value, formData.newPassword.value) === 'VALID'


        if (!isValidData) return

        const data = prepareDataToSubmit()
        setLoading(true)
        try {
            const url = `${import.meta.env.VITE_API_URL}/users/changePassword`
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

            await axios.post(url, data, { headers: headers })
            swalls.updateAccountInfoSwal("Your password changed successfully")
        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({ severity: 'error', message: 'Unable to connect with server. Try again' })
            }
            else if (error.status == 401) {
                localStorage.removeItem('ACCESS_TOKEN')
                navigate('/signin', { state: { message: 'Session Expired. Sign in again to continue' } })
            }
            else if (error.status == 400) {
                setFormData({ ...formData, currentPassword: { ...formData['currentPassword'], errorMsg: 'Please enter your correct current password' } })
            }
            else if (error.status == 404) {
                localStorage.removeItem('ACCESS_TOKEN')
                navigate('/signin', { state: { message: 'Access Denied' } })
            }
            else {
                setAlertMsg({ severity: 'error', message: "Oops! An error occured during change password process. Try again" })
            }
        }
        setLoading(false)
    }

    const deleteAccount = () => {
        swalls.deleteAccoutSwal()
    }

    return (
        <div className="flex flex-col p-10">

            <h1 className="text-[28px]"> <LockIcon /> Edit your account password</h1>
            <Divider />
            {alertMsg.message && <Alert sx={{ mt: 1 }} severity={alertMsg.severity}>{alertMsg.message}</Alert>}

            <div className="pt-4 flex flex-col items-start justify-center gap-1 sm:w-full lg:w-[500px]">
                <InputText required type="password" title="Current password" placeholder="Enter your current password" name="currentPassword"
                    id="password"
                    value={formData.currentPassword.value}
                    validation_error={formData.currentPassword.errorMsg}
                    changeHandler={handleChange}
                />
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
                <Button size='small' fullWidth variant="contained" loading={loading} onClick={changePassword}
                    sx={{ backgroundColor: "var(--dark-bg)", textTransform: 'none', mt: 1, fontWeight: '400' }}
                >Change Password
                </Button>

                <Button variant="contained" color="error" sx={{ textTransform: 'none', mt: 2, float: 'left' }}
                    onClick={deleteAccount}>
                    Delete Account
                </Button>
            </div>
        </div>
    )
}