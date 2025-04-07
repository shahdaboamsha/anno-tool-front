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
                        <SigninForm />
                    </Grid>
                </div>

            </div >
        </Fade>
    )
}

export default SigninPage