import InputText from "../../components/Inputs/InputText"
import inputValidators from "../../utils/inputValidators"
import { useState, useEffect } from "react"
import { Fade, Alert, Button } from "@mui/material"
import NavigationBar from "../../components/Public/NavigationBar"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function ForgotPasswordPage() {
    document.title = "Recover your account"
    useEffect(() => {localStorage.getItem('ACCESS_TOKEN')? navigate('/dashboard/security') : ""}, [])

    const navigate = useNavigate()
    const [email, setEmail] = useState({
        value: "",
        errorMsg: null
    })
    const [alertMsg, setAlertMsg] = useState({ severity: 'error', message: null})
    const [loading, setLoading] = useState(false)

    const validateInput = (event) => {
        const { name, value } = event.target
        if (value === "") return 'VALID'
        return inputValidators.validate(name, value)
    }

    // track the changes over the fields
    const handleChange = (event) => {
        const { value } = event.target

        const validation = validateInput(event)
        const errorMsg = validation != 'VALID' ? validation : null

        setEmail({ value: value, errorMsg: errorMsg })
    }

    const requestPasswordChange = async () => {

        const validation = inputValidators.validate('email', email.value)
        const errorMsg = validation === 'VALID' ? null : validation
        setEmail({ ...email, errorMsg: errorMsg })

        if (validation != 'VALID') return

        setLoading(true)
        try {
            const url = `http://localhost:3000/auth/sendcode`
            const token = (await axios.post(url, {email: email.value})).data.token
            localStorage.setItem('RECOVER_ACCOUNT_TOKEN', token)
            navigate('/recover/verify', { state: {verify: true, message: `We send a code to your email address ${email.value}. Please check your mail inbox to reset your password`}})
        } catch (error) {
            console.log(error)
            setAlertMsg({severity: 'error', message: `Oops! an error occured`})
        }
        setLoading(false)

    }

    return (
        <Fade in timeout={700}>
            <div className="h-screen flex flex-col items-center justify-start relative gap-5">
                <div style={{ width: '100%', backgroundColor: 'var(--dark-bg)' }}>
                    <NavigationBar />
                </div>

                <div className='shadowed text-[14px] mt-5 max-w-[400px]'>
                    <h1 className='text-[28px] text-center'>Recover your account</h1>
                    <p className='text-gray-500 text-[14px] text-center'>Please type your email and submit to recover your account password</p>
                    {alertMsg.message? <Alert severity={alertMsg.severity}>{alertMsg.message}</Alert> : ""}

                    <InputText required type='email' name='email' title='Email address' id='email' placeholder='Email address'
                        value={email.value}
                        changeHandler={handleChange}
                        validation_error={email.errorMsg}
                    />
                    <Button fullWidth loading={loading} variant="contained" sx={{ bgcolor: 'var(--dark-bg)', textTransform: 'none', mt: 1 }} onClick={requestPasswordChange} >
                        Recover Password
                    </Button>
                </div>
            </div >

        </Fade>
    )
}