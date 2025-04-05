import signinPageStyle from './style_modules/signinPage.module.css'
import SigninForm from "../../components/SigninForm"
import Grid from '@mui/material/Grid2'
import { Fade } from '@mui/material'

function SigninPage() {
    document.title = "Sign in"
    
    return (
        <Fade in timeout={700}>
        <div className='page-container'>
            <div className='shadowed'>
                <Grid container width={{ lg: 400, sm: 390, xs: 350 }} columns={12}>
                    <div>
                        <h1 className='form-header'>Sign in</h1>
                        <p className='form-header-desc'>Type your email and password to sign in to your account</p>
                    </div>

                    <SigninForm />

                    <div className={signinPageStyle.signinHelp}>
                        <p>Don't have account? <a href='/signup'>Sign up</a></p>
                        <p>Forgot your password? <a href="/recover">Recover your account</a></p>
                    </div>
                </Grid>
            </div>

        </div >
        </Fade>
    )
}

export default SigninPage