import SignupForm from "../../components/SignupForm"
import Grid from '@mui/material/Grid2'
import signupPageStyles from './style_modules/SignupPage.module.css'
import { Fade } from "@mui/material"
import Loader from "../../components/Loader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SignupPage() {

    const navigate = useNavigate()

    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        const isLoggedIn = () => {
            return localStorage.getItem('ACCESS_TOKEN') != null
        }
        isLoggedIn() ? navigate('/dashboard') : setPageLoading(false)
    }, [])


    document.title = "Sign up"
    return (
        <>

            {
                pageLoading ? <Loader />
                    :
                    <Fade in timeout={700}>
                        <div className={signupPageStyles.pageContainer}>
                            <div className={signupPageStyles.shadowedRounded}>
                                <Grid container width={{ lg: 800, sm: 380, xs: 380 }} columns={12} >
                                    {/** Title Grid */}
                                    <Grid
                                        size={{ lg: 6, md: 12, xl: 6 }}
                                        sx={{
                                            display: { xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'block' }
                                        }}
                                    >
                                        <div
                                            className={`${signupPageStyles.flexColumsCenteredItems} ${signupPageStyles.pinkyBgColor} ${signupPageStyles.shadowedRounded}`}
                                        >
                                            <h1 className={signupPageStyles.boldHeader}>Welcome</h1>
                                            <h3>Join our unique platform. Explore a new experience</h3>
                                        </div>
                                    </Grid>

                                    <Grid
                                        size={{ lg: 6, md: 12, xs: 12, xl: 6, sm: 12 }}
                                        sx={{ padding: 2 }}
                                    >
                                        <SignupForm />
                                    </Grid>
                                </Grid>
                            </div>

                        </div>
                    </Fade>}
        </>
    )
}