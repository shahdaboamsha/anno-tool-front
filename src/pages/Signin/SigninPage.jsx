import signinPageStyle from './style_modules/signinPage.module.css'
import SigninForm from "../../components/SigninForm"
import Grid from '@mui/material/Grid2'
import { Fade } from '@mui/material'
import Loader from "../../components/Loader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavigationBar from '../../components/NavigationBar'

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

                    <div className='page-container text-[14px]'>
                        <div style={{
                            position: 'absolute',
                            top: '0px',
                            width: '100%',
                            backgroundColor: 'var(--dark-bg)'
                        }}>
                            <NavigationBar />
                        </div>
                        <div className='shadowed text-[14px] mt-5'>
                            <Grid container width={{ lg: 350, sm: 390, xs: 350 }} columns={12}>
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