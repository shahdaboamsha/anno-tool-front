import signinPageStyle from './style_modules/signinPage.module.css'
import SigninForm from "../../components/SigninForm"
import Grid from '@mui/material/Grid2'
import { Fade } from '@mui/material'
import Loader from "../../components/Loader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function SigninPage() {

    const navigate = useNavigate()

    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        const isLoggedIn = () => {
            return localStorage.getItem('ACCESS_TOKEN') != null
        }
        isLoggedIn() ? navigate('/dashboard') : setPageLoading(false)
    }, [])

    document.title = "Sign in"

    return (
        <>
            {pageLoading ? <Loader />
                :
                <Fade in timeout={700}>
                    <div className='page-container'>
                        <div className='shadowed'>
                            <Grid container width={{ lg: 400, sm: 390, xs: 350 }} columns={12}>
                                <SigninForm />
                            </Grid>
                        </div>

                    </div >
                </Fade>
            }
        </>
    )
}

export default SigninPage