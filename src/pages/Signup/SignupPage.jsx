import SignupForm from "../../components/Forms/SignupForm"
import './style_modules/SignupPage.module.css'
import { Fade, useMediaQuery } from "@mui/material"
import Loader from "../../components/Loaders/Loader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import signupLogo from '../../assets/signup-img.jpg'
import NavigationBar from '../../components/Public/NavigationBar'
import { useTheme } from "@mui/material"
import clsx from "clsx"

export default function SignupPage() {

    const navigate = useNavigate()
    const [pageLoading, setPageLoading] = useState(true)

    useEffect(() => {
        const isLoggedIn = () => {
            return localStorage.getItem('ACCESS_TOKEN') != null
        }
        isLoggedIn() ? navigate('/dashboard') : setPageLoading(false)
    }, [])
    const theme = useTheme()
    const isWideScreen = useMediaQuery(theme.breakpoints.up('md'))

    document.title = "Sign up"
    return (
        <>
            {
                pageLoading ? <Loader /> :
                    <Fade in timeout={700}>
                        <div className="h-screen flex flex-col items-center justify-start relative gap-5">
                            <div className="w-full" style={{ backgroundColor: 'var(--dark-bg)' }}>
                                <NavigationBar />
                            </div>
                            <div className=" mt-4 flex items-stretch justify-center rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl rounded-br-2xl" style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 2px" }}>
                                {
                                    isWideScreen ?
                                        <div style={{ backgroundImage: `url(${signupLogo})`, backgroundBlendMode: 'multiply', backgroundColor: '#83a894', objectFit: 'cover' }}
                                            className="p-4 w-1/2 flex flex-col items-center justify-center rounded-tl-2xl rounded-bl-2xl"

                                        >
                                            <h1 className="text-[36px] text-white text-center">Welcome</h1>
                                            <h1 className="text-[16px] text-white text-center">Join our unique platform. Explore a new experience</h1>
                                        </div> : ""
                                }

                                <div className="p-4 max-w-[400px]">
                                    <SignupForm />
                                </div>
                            </div>
                        </div>
                    </Fade>
            }
        </>
    )
}