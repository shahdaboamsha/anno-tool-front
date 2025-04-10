import InputText from './InputText'
import { useState, useEffect } from 'react'
import { Button } from "@mui/material"
import styles from './style_modules/InputText.module.css'
import './style_modules/styles.css'
import { Alert } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FormHeader from './style_modules/FormHeader'

function SigninForm() {

    const [formData, setFormData] = useState({
        email: {
            value: "",
            error: ""
        },
        password: {
            value: "",
            error: ""
        }
    })


    const [signinResponse, setSigninResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // 
    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: { value: value, error: null } })
    }

    const handleBlur = (event) => {
        const { name, value } = event.target

        if (value.trim() != "") {
            setFormData({ ...formData, [name]: { value: value, error: null } })
        }
        else {
            setFormData({ ...formData, [name]: { value: value, error: `Please enter your ${name} to sign in to your account` } })
        }
    }

    const validateBeforeSubmit = () => {

        const data = {}

        const getKeyValue = () => {
            Object.entries(formData).forEach(input => {
                data[input[0]] = input[1].value
            })
        }

        getKeyValue()

        let newFormData = { ...formData };

        let isReadyForSubmit = true

        for (const key in data) {

            const value = data[key];
            const validationResult = value.trim() == "";

            if (validationResult) {
                isReadyForSubmit = false
                newFormData[key] = { value, error: `Please enter your ${key} to sign in to your account` };
            }
        }

        setFormData(newFormData)
        return isReadyForSubmit
    }


    const signin = async (event) => {
        event.preventDefault()

        if (!validateBeforeSubmit()) {
            return
        }

        axios.defaults.withCredentials = true
        setLoading(true)
        try {

            const signinResponse = await axios.post('http://localhost:3000/auth/login', {
                email: formData.email.value,
                password: formData.password.value
            })
            setSigninResponse({
                message: 'User signed in successfully',
                isSuccess: true
            })
            localStorage.setItem('ACCESS_TOKEN', signinResponse.data.token)
            navigate('/dashboard')

        } catch (error) {
            if (error.code == "ERR_NETWORK") {
                setResponse({
                    message: "Oops! Could not connect to the server. Please try again later.",
                    isSuccess: false
                })
            }
            else {
                const { data } = error.response
                console.log(data)

                if (error.status === 401) {
                    setSigninResponse({
                        message: data.ErrorMsg,
                        isSuccess: false
                    })
                }
                else if (error.status === 500) {
                    setSigninResponse({
                        message: "Oh Sorry! The operation could not be completed due to a server error. Please try again later",
                        isSuccess: false
                    })
                }
            }
        }

        setLoading(false)

    }

    return (
        <>
            <div style={{ width: '100%' }}>
                <FormHeader title='Sign in' text='Type your email and password to sign in to your account' />
                {signinResponse && <Alert severity={!signinResponse.isSuccess ? 'error' : 'success'}>{signinResponse.message}</Alert>}
                <InputText
                    required
                    id="email"
                    type="email"
                    title="Email address"
                    name="email"
                    value={formData.email.value}
                    validation_error={formData.email.error}
                    changeHandler={handleChange}
                    blurHandler={handleBlur}
                />
                <InputText
                    required
                    id="password"
                    type="password"
                    title="Password"
                    name="password"
                    value={formData.password.value}
                    validation_error={formData.password.error}
                    changeHandler={handleChange}
                    blurHandler={handleBlur}
                />
                <div className={styles.inputText}>
                    <Button
                        size='large'
                        loading={loading}
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: "var(--dark-bg)", textTransform: 'none', fontWeight: '400' }}
                        onClick={signin}
                    >
                        Sign in
                    </Button>
                </div>
                
                <div className='font-4px mt-8 flex flex-col justify-center items-center text-center'>
                    <p>Don't have an account? <a href='/signup' className="text-[14px] text-blue-400 hover:text-blue-800">Sign up</a></p>
                    <p>Forgot your password? <a href="/recover" className="text-[14px] text-blue-400 hover:text-blue-800">Recover your account</a></p>
                </div>


            </div>


        </>
    )
}

export default SigninForm