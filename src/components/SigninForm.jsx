import InputText from './InputText'
import { useState } from 'react'
import { Button } from "@mui/material"
import styles from './style_modules/InputText.module.css'
import Fade from '@mui/material/Fade';

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

    const [loading, setLoading] = useState(false)


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


    const signin = (event) => {
        event.preventDefault()

        if (!validateBeforeSubmit()) {
            return
        }

        setLoading(true)

    }
    return (
        
            <div style={{ width: '100%' }}>
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
                        sx={{ backgroundColor: "#ff8fab", textTransform: 'none', fontWeight: '400' }}
                        onClick={signin}
                    >
                        Sign in
                    </Button>
                </div>

            </div>

    )
}

export default SigninForm