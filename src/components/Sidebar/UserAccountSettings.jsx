import { useState } from "react";
import InputText from "../Inputs/InputText";
import InputDate from "../Inputs/InputDate";
import inputValidators from "../../utils/inputValidators";
import { Button, Divider, Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import * as swals from '../Public/Swals'
import * as services from '../../utils/services.module'
import ResponseMessage from "../../utils/ResponsesMessage";
import SessionController from "../../utils/SessionController";
axios.defaults.withCredentials = true;
export default function UserAccountSettings() {

    const navigate = useNavigate()
    const { userData, notifyEditingUser } = useOutletContext()

    const [formData, setFormData] = useState({
        userName: {
            value: userData.userName,
            errorMsg: null
        },
        email: {
            value: userData.email,
            errorMsg: null
        },
        dateofbirth: {
            value: userData.dateofbirth.split(" ")[0],
            errorMsg: null
        }
    })

    const [loading, setLoading] = useState(false)
    const [alertMsg, setAlertMsg] = useState({ severity: null, message: null })

    // validate the change of the inputs
    const validateInput = (event) => {
        const { name, value } = event.target
        if (name === "password") return 'VALID'
        return inputValidators.validate(name, value)

    }

    // track the changes over the fields
    const handleChange = (event) => {
        const { name, value } = event.target

        const validation = validateInput(event)
        const errorMsg = validation != 'VALID' ? validation : null

        setFormData({ ...formData, [name]: { value: value, errorMsg: errorMsg } })
    }

    const prepareDataToSubmit = () => {
        const dataToSubmit = {}
        for (const key in formData) {
            dataToSubmit[key] = formData[key]['value']
        }

        return dataToSubmit
    }

    const editMyData = async (event) => {

        const isValid = inputValidators.validateSignupDataBeforeSubmit(formData, setFormData)
        if (!isValid) return

        const data = prepareDataToSubmit()
        setLoading(true)
        try {
            const url = `${import.meta.env.VITE_API_URL}/users/editAccountInfo`
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }

            await axios.post(url, data, { headers: headers })
            swals.swalDialog("success", "Profile updated successfully")
            
            notifyEditingUser()

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({ severity: 'error', message: ResponseMessage.ERR_NETWORK_MSG })
            }
            else if (error.status == 401) {
                const refreshError = await SessionController.refreshToken()
                if (refreshError instanceof Error) {
                    localStorage.removeItem('ACCESS_TOKEN')
                    navigate('/signin', { state: { message: ResponseMessage.UN_AUTHORIZED_MSG } })
                }
                else {
                    await editMyData()
                }
            }
            else if (error.status == 404) {
                localStorage.removeItem('ACCESS_TOKEN')
                navigate('/signin', { state: { message: 'Access Denied' } })
            }
            else {
                setAlertMsg({ severity: 'error', message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG })
                console.log(error)
            }
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col p-10">
            <h1 className="text-[28px]"> <EditIcon /> Edit your account infotmation</h1>
            <Divider />

            {alertMsg.message && <Alert sx={{ mt: 2 }} severity={alertMsg.severity}>{alertMsg.message}</Alert>}
            <div className="pt-4 flex flex-col items-center justify-center gap-1 sm:w-full lg:w-[500px]">

                <div className="w-full mb-1 text-gray-500">
                    <p className="text-right text-[14px]">Updated at {services.formatDateToLong(userData.updatedAt)}</p>
                </div>

                <InputText required ype="text" title="Your name" name="userName" id="userName"
                    value={formData.userName.value}
                    validation_error={formData.userName.errorMsg}
                    changeHandler={handleChange}
                />
                <InputText required type="email" title="Email" name="email" id="email"
                    value={formData.email.value}
                    validation_error={formData.email.errorMsg}
                    changeHandler={handleChange}
                />
                <InputDate name='dateofbirth' title="Date of Birth" placeholder='Date of Birth'
                    value={formData.dateofbirth.value}
                    validation_error={formData.dateofbirth.errorMsg}
                    changeHandler={handleChange}
                />
                <Button size='small' variant="contained" fullWidth onClick={editMyData} loading={loading}
                    sx={{ backgroundColor: "var(--dark-bg)", textTransform: 'none', fontWeight: '400', mt: 1 }}
                >Save Changes
                </Button>

            </div>
        </div>
    )
}