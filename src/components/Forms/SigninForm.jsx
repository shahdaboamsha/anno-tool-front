import InputText from '../Inputs/InputText'
import { useState } from 'react'
import { Button, Alert } from "@mui/material"
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import inputValidators from '../../utils/inputValidators'
import ResponseMessage from '../../utils/ResponsesMessage'

export default function SigninForm() {

    const location = useLocation()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: {
            value: "",
            errorMsg: ""
        },
        password: {
            value: "",
            errorMsg: ""
        }
    })

    const [loading, setLoading] = useState(false)
    const [alertMsg, setAlertMsg] = useState({
        isError: false,
        message: null
    })

    // is the changes is valid data?
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

    const signin = async () => {

        setLoading(true)
        try {
            axios.defaults.withCredentials = true
            const ACCESS_TOKEN = (await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email: formData.email.value,
                password: formData.password.value
            })).data.token

            localStorage.setItem('ACCESS_TOKEN', ACCESS_TOKEN)
            location.state && location.state.nextUrl ? navigate(`/dashboard/${location.state.nextUrl}`) : navigate(`/dashboard/overview`)

        } catch (error) {
            if (error.code == "ERR_NETWORK") {

                setAlertMsg({
                    message: ResponseMessage.ERR_NETWORK_MSG,
                    isError: true
                })
            }
            else if (error.status == 401) {
                setAlertMsg({
                    isError: true,
                    message: "Incorrect email or password"
                })
                setFormData({
                    email: { ...formData['email'], errorMsg: true },
                    password: { ...formData['password'], errorMsg: true }
                })
            }
            else if (error.status === 500) {
                setAlertMsg({
                    isError: true,
                    message: ResponseMessage.INTERNAL_SERVER_ERROR_MSG
                })
            }
        }
        setLoading(false)
    }

    return (
        <>
            <div style={{ width: '100%' }} className='flex flex-col gap-1 max-w-[400px]'>
                <h1 className='text-[28px] text-center'>Sign in</h1>
                <p className='text-gray-500 text-[14px] text-center mb-3'>Type your email and password to sign into your account</p>

                {location.state != null && <Alert sx={{ mb: 2 }} severity={location.state.notError ? 'success' : 'error'}>{location.state.message}</Alert>}
                {alertMsg.isError && <Alert sx={{ mb: 2 }} severity='error'>{alertMsg.message}</Alert>}
                <div className='flex flex-col gap-1'>
                    <InputText autoFocus required id="email" type="email" title="Email address" name="email"
                        widthDetection={false}
                        value={formData.email.value}
                        validation_error={formData.email.errorMsg}
                        changeHandler={handleChange}
                        startIcon={<PersonIcon fontSize='small' color='action' />}
                    />
                    <InputText required id="password" type="password" title="Password" name="password"
                        value={formData.password.value}
                        validation_error={formData.password.errorMsg}
                        changeHandler={handleChange}
                        startIcon={<LockIcon fontSize='small' color='action' />}
                        widthDetection={false}
                    />

                </div>


                <p className='text-[14px] text-left mt-3 mb-3'>Forgot your password? <a href="/recover" className="text-blue-400 hover:text-blue-800">Recover your account</a></p>

                <Button
                    size='small'
                    loading={loading}
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "var(--dark-bg)", textTransform: 'none', fontWeight: '400', color: 'white' }}
                    onClick={signin}
                >
                    Sign in
                </Button>

                <p className='text-[14px] mt-2 text-center'>Don't have an account? <a href='/signup' className="text-blue-400 hover:text-blue-800">Sign up</a></p>


            </div>


        </>
    )
}

