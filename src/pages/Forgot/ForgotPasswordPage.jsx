import InputText from "../../components/Inputs/InputText"
import inputValidators from "../../utils/inputValidators"
import { useState, useEffect } from "react"
import { Fade, Grid2 as Grid, Button } from "@mui/material"

export default function ForgotPasswordPage() {

    const [email, setEmail] = useState({
        value: "",
        error: null
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setEmail({ value: value, error: null })
    }

    const handleInputBlur = (e) => {
        const { name, value } = event.target

        if (value.trim() === "") {
            setEmail({ ...email, error: null })
            return
        }

        const validationResult = inputValidators.validate(name, value)

        if (validationResult != "VALID") {
            setEmail({ ...email, error: validationResult })
        }

    }

    return (
        <Fade in timeout={700}>
            <div className='page-container' >
                <div className='shadowed'>
                    <Grid container width={{ lg: 400, sm: 390, xs: 350 }} columns={12}>
                        <div>
                            <h1 className='form-header'>Recover your account</h1>
                            <p  className='form-header-desc'>Forgot password? Please type your email and submit to recover your account password</p>
                        </div>

                        <InputText
                            required
                            type='email'
                            name='email'
                            title='Email address'
                            id='email'
                            placeholder='Email address'
                            value={email.value}
                            changeHandler={handleInputChange}
                            blurHandler={handleInputBlur}
                            validation_error={email.error}
                            
                        />
                        <div style={{ width: '100%' }}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ bgcolor: 'var(--dark-bg)', textTransform: 'none', marginTop: '15px' }}
                            >
                                Recover Password
                            </Button>
                        </div>
                    </Grid>
                </div>

            </div >
        </Fade>
    )
}