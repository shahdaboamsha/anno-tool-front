import SignupForm from "../../components/SignupForm"
import Grid from '@mui/material/Grid2'
import signupPageStyles from './style_modules/SignupPage.module.css'
import { Fade } from "@mui/material"
import Loader from "../../components/Loader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavigationBar from '../../components/NavigationBar'
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
                        <div className='flex flex-col items-center'>
                            <div style={{
                                top: '0px',
                                width: '100%',
                                backgroundColor: 'var(--dark-bg)'
                            }}>
                                <NavigationBar />
                            </div>
                            <div className="shadowed rounded-xl bg-white text-[14px] mt-2" style={{width: 'fit-content'}}>
                                <Grid container width={{ lg: 800, sm: 380, xs: 380 }} columns={12}>
                                    {/* Title Grid */}
                                    <Grid
                                        size={{ lg: 6, md: 12, xl: 6 }}
                                        sx={{
                                            display: { xs: 'none', sm: 'none', md: 'none', lg: 'block', xl: 'block' },
                                        }}
                                    >
                                        <div
                                            className={`${signupPageStyles.pinkyBgColor} h-full rounded-l-xl flex flex-col justify-center items-center`}
                                        >
                                            <h1 className="text-[30px]">Welcome</h1>
                                            <h3>Join our unique platform. Explore a new experience</h3>
                                        </div>
                                    </Grid>

                                    <Grid size={{ lg: 6, md: 12, xs: 12, xl: 6, sm: 12 }}>
                                        <div className="p-4 h-full bg-white rounded-r-xl">
                                            <SignupForm />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>


                        </div>
                    </Fade>}
        </>
    )
}