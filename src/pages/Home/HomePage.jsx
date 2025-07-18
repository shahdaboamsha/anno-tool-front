import { Grid2 as Grid, Typography, Button } from "@mui/material"
import { useMediaQuery, useTheme } from '@mui/material';
import SigninForm from "../../components/Forms/SigninForm";
import { useNavigate } from "react-router-dom";
import { useState, } from "react";
import QuickDialog from "../../components/Public/QuickDialog";
import NavigationBar from "../../components/Public/NavigationBar";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import account from '../../assets/acc.jpg'
import Card from "./Card";
import share from '../../assets/share.png'
import classify from '../../assets/classify.jpg'
import shahd from '../../assets/our/shahd.png'
import nagham from '../../assets/our/nagham.png'
import mais from '../../assets/our/mais.png'
import Footer from "./Footer";
import clsx from "clsx";

const quickActionButtonProps = {
    borderRadius: '0px',
    textTransform: 'none',
    padding: 1,
    width: '300px',
    fontSize: '18px',
}
export default function HomePage() {

    document.title = "Annotation Tool"

    const navigate = useNavigate()
    const theme = useTheme()
    const isWideScreen = useMediaQuery(theme.breakpoints.up('md'))

    const [dialogOpenState, setDialogOpenState] = useState(false)
    const [component, setComponent] = useState(<SigninForm />)

    // handle Get Started button -> open the form of the task creation or go to the dashboard
    const getStarted = () => localStorage.getItem('ACCESS_TOKEN') ? navigate('/dashboard/overview') : setDialogOpenState(true)

    return (
        <div>
            <div className={`text-white flex flex-col justify-center ${isWideScreen ? "items-start" : "items-center"} white-text home-img-container`}
                style={{ height: `${isWideScreen ? '90vh' : '70vh'}`, position: 'relative' }} >

                <div style={{ position: 'absolute', top: '0px', width: '100%' }}>
                    <NavigationBar />
                </div>
                <div className={`text-white flex flex-col justify-center ${isWideScreen ? "items-start pt-5 w-[700px]" : "items-center text-center"} p-5 white-text gap-3`}>

                    <Typography fontWeight={700} variant={isWideScreen ? 'h4' : 'h4'} sx={{ color: 'white' }} >
                        Streamline Your Data with Our Text Annotation Tool
                    </Typography>

                    <Typography variant={isWideScreen ? 'subtitle1' : 'body2'} marginTop={1} sx={{ color: 'white' }}  >
                        Easily upload your files and classify words with precision.
                    </Typography>

                    <Typography variant={isWideScreen ? 'subtitle1' : 'body2'} sx={{ color: 'white' }} >
                        Our intuitive tool simplifies annotation, helping you organize and analyze text effortlessly. Start streamlining your data today!
                    </Typography>

                    <div>
                        <Button id="quick-action-button" variant="contained" sx={{ ...quickActionButtonProps }} onClick={getStarted}
                            endIcon={<ArrowForwardIcon className="arrow-icon" fontSize='large' />}>
                            Get started
                        </Button>
                        <QuickDialog
                            openState={dialogOpenState}
                            setOpenState={setDialogOpenState}
                            component={component} />
                    </div>
                </div>


            </div>

            <div className="p-5 pt-20 pb-20 ">
                <h1 className="text-[42px] text-center font-extrabold animation-view"> Our Site Features </h1>
                <div className="flex justify-start gap-5 flex-wrap mt-3">
                    <Card
                        title="Create your account"
                        description="Sign up to signin to your account"
                        image={account}
                        action="Create account"
                    />
                    <Card
                        title="Classify your sentence"
                        description="Upload your dataset to classify your sentences"
                        image={classify}
                        action="Annotate your tasks"
                    />
                    <Card
                        title="Collaborating"
                        description="Multi annotators works on same task"
                        image={share}
                    />
                </div>

            </div>

            <div className="p-5 pt-15 pb-20 animation-view" style={{ backgroundColor: "black", color: 'white' }}>
                <h1 className="text-[42px] text-center font-extrabold animation-view"> Classify with Artifical Intelligence </h1>
                <div className="flex justify-center items-center gap-5 flex-wrap-reverse">
                    <p className="text-[18px] max-w-[500px] animation-view">
                        TexAI is a smart platform for annotating Arabic text using the power of both AI and human collaboration.
                        Create tasks, assign annotators, and watch your data get labeled accurately and efficiently.                    </p>
                    <div className="max-w-[350px] animation-view">
                        <img className="animation-view" src="https://static.vecteezy.com/system/resources/previews/051/135/280/non_2x/ai-robot-typing-on-ipad-isolated-on-transparent-background-free-png.png" alt="" loading="lazy" />
                    </div>
                </div>
            </div>

            <div className="p-2 pt-15 pb-20 flex flex-col justify-center items-center gap-3 ptuk-bg animation-view">
                <h1 className="text-[42px] text-center font-extrabold mt-3 text-white animation-view"> About US </h1>

                <div className="flex flex-col items-center justify-center animation-view developer-images-box">
                    <div className="flex justify-center items-center flex-wrap ">
                        <div className="max-w-[500px] developer-img ">
                            <img src={shahd} alt="" loading="lazy" />
                        </div>
                        <div className="max-w-[500px] developer-img">
                            <img src={mais} alt="" loading="lazy" />
                        </div>
                        <div className="max-w-[500px] developer-img">
                            <img src={nagham} alt="" loading="lazy" />
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
