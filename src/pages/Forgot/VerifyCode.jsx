import InputText from "../../components/Inputs/InputText"
import inputValidators from "../../utils/inputValidators"
import { useState, useEffect } from "react"
import { Fade, Alert, Button } from "@mui/material"
import NavigationBar from "../../components/Public/NavigationBar"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useLocation } from "react-router-dom"

export default function VerifyCode() {

    const location = useLocation()
    useEffect(() => {
        localStorage.getItem('ACCESS_TOKEN') ||
            !location.state ||
            !localStorage.getItem('RECOVER_ACCOUNT_TOKEN') ? navigate('/signin') : ""
    }, [])

    const navigate = useNavigate()
    const [code, setCode] = useState({ value: "", errorMsg: null })

    const [alertMsg, setAlertMsg] = useState({ severity: 'error', message: null })
    const [loading, setLoading] = useState(false)

    // track the changes over the fields
    const handleChange = (event) => {
        const { value } = event.target
        setCode({ value: value, errorMsg: null })
    }

    const VerifyCode = async () => {

        if (code.value.trim() === "") {
            setCode({ ...code, errorMsg: "Please enter your code which we sent to your email" })
        }
        setLoading(true)
        try {
            const url = `http://localhost:3000/auth/verify-code`
            const headers = { Authorization: `Bearer ${localStorage.getItem('RECOVER_ACCOUNT_TOKEN')}` }
            await axios.post(url, { code: code.value }, { headers: headers })

            navigate('/recover/reset', { state: { reset: true, message: "Please enter your new password to recover your account" } })
        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setAlertMsg({ severity: 'error', message: 'Unable to connect with server. Try again' })
            }
            else if (error.status == 401) {
                localStorage.removeItem('RECOVER_ACCOUNT_TOKEN')
                navigate('/signin', { state: { message: 'Access Denied' } })
            }
            else if (error.status == 400) {
                setAlertMsg({ severity: 'error', message: 'Inccorect code. Please enter the code which sent to your email'})
            }
            else if (error.status == 404) {
                localStorage.removeItem('RECOVER_ACCOUNT_TOKEN')
                navigate('/signin', { state: { message: 'Access Denied' } })
            }
            else {
                setAlertMsg({ severity: 'error', message: "Oops! An error occured during reset your password process. Try again" })
            }
        }
        setLoading(false)

    }

    return (
        <Fade in timeout={700}>
            <div className="h-screen flex flex-col items-center justify-start relative gap-5">
                <div style={{  width: '100%', backgroundColor: 'var(--dark-bg)' }}>
                    <NavigationBar />
                </div>

                <div className='shadowed text-[14px] mt-5 max-w-[400px]'>
                    <h1 className='text-[28px] text-center'>Almost Done</h1>
                    <p className='text-[14px] text-center'>{location.state ? location.state.message : ""}</p>
                    {alertMsg.message ? <Alert severity={alertMsg.severity}>{alertMsg.message}</Alert> : ""}

                    <InputText required type='text' name='code' title='Verifying code' id='code' placeholder='# # # # # #'
                        value={code.value}
                        changeHandler={handleChange}
                        validation_error={code.errorMsg}
                    />
                    <Button fullWidth loading={loading} variant="contained" sx={{ bgcolor: 'var(--dark-bg)', textTransform: 'none', mt: 1 }} onClick={VerifyCode} >
                        Verify
                    </Button>
                </div>
            </div >

        </Fade>
    )
}