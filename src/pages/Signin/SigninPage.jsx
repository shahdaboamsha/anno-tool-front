import SigninForm from "../../components/Forms/SigninForm"
import Grid from '@mui/material/Grid2'
import { Fade } from '@mui/material'
import Loader from "../../components/Loaders/Loader"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavigationBar from '../../components/Public/NavigationBar'

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
                    <div className="h-screen flex flex-col items-center justify-start relative gap-5">
                        <div style={{ width: '100%', backgroundColor: 'var(--dark-bg)' }}>
                            <NavigationBar />
                        </div>

                        <div className='shadowed text-[14px] mt-5'>
                            <SigninForm />
                        </div>
                    </div >
                </Fade>
            }
        </>
    )
}

export default SigninPage