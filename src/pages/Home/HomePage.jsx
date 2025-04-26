import { Grid2 as Grid, Typography, Button } from "@mui/material"
import { useMediaQuery, useTheme } from '@mui/material';
import SigninForm from "../../components/Forms/SigninForm";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import QuickDialog from "../../components/Public/QuickDialog";
import NavigationBar from "../../components/Public/NavigationBar";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import clsx from 'clsx'
import account from '../../assets/acc.jpg'
import Card from "./Card";
import share from '../../assets/share.png'
import classify from '../../assets/classify.jpg'
import shahd from '../../assets/our/shahd.png'
import nagham from '../../assets/our/nagham.png'
import mais from '../../assets/our/mais.png'
import Footer from "./Footer";

const quickActionButtonProps = {
    margin: 2,
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
    const getStarted = () => localStorage.getItem('ACCESS_TOKEN')? navigate('/dashboard/overview') :  setDialogOpenState(true)
    
    return (
        <div>
<<<<<<< HEAD
            <div
                className='text-white flex gap-3 flex-col items-center justify-center white-text center-text home-img-container'
                style={{ height: `${isWideScreen ? '98vh' : '80vh'}`, position: 'relative' }}
            >
                <div style={{ position: 'absolute', top: '0px', width: '100%' }}>
                    <NavigationBar />
                </div>

                <h1 className={clsx("font-bold text-[42px]", !isWideScreen ? "mt-10" : "")}>Streamline Your Data with Our Text Annotation Tool</h1>
                <h1 className="text-[16px]">Our intuitive tool simplifies annotation, helping you organize and analyze text effortlessly. Start streamlining your data today!</h1>
                <h1 className="text-[16px]">Easily upload your files and classify words with precision</h1>

                <div>
                    <Button id="quick-action-button" variant="contained" onClick={getStarted}
                        sx={{ ...quickActionButtonProps }}
                        endIcon={<ArrowForwardIcon className="arrow-icon" fontSize='large' />}
                    >
=======
            <div className='text-white flex flex-centered-items flex-column-items white-text center-text home-img-container'
                style={{ height: `${isWideScreen ? '90vh' : '70vh'}`,  position: 'relative' }} >
               
                <div style={{ position: 'absolute', top: '0px',  width: '100%' }}>
                    <NavigationBar />
                </div>

                <Typography fontWeight={700} variant={isWideScreen ? 'h2' : 'h4'} sx={{color: 'white'}} >
                    Streamline Your Data with Our Text Annotation Tool
                </Typography>

                <Typography variant={isWideScreen ? 'h6' : 'body2'}  marginTop={1} sx={{color: 'white'}}  >
                    Easily upload your files and classify words with precision
                </Typography>
                
                <Typography variant={isWideScreen ? 'h6' : 'body2'}  sx={{color: 'white'}} >
                    Our intuitive tool simplifies annotation, helping you organize and analyze text effortlessly. Start streamlining your data today!
                </Typography>
                
                <div>
                    <Button id="quick-action-button" variant="contained" sx={{ ...quickActionButtonProps }} onClick={getStarted}
                        endIcon={ <ArrowForwardIcon className="arrow-icon" fontSize='large' /> }>
>>>>>>> 903b1e3445f62050af3615010feb8238e85b04fe
                        Get started
                    </Button>
                    <QuickDialog 
                        openState={dialogOpenState}
                        setOpenState={setDialogOpenState}
                        component={component} />
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
                        Our platform now features an  AI-powered annotation tool that automatically annotates the sentences in your uploaded files. As soon as you upload a task, the AI quickly processes and provides initial annotations, helping you save time and effort. You can then review, adjust, and finalize the annotations with ease, making the overall workflow faster, smarter, and more efficient.
                    </p>
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
                            <img src={nagham} alt=""  />
                        </div>
                    </div>
                    <p className="animation-view text-[18px] max-w-[900px] text-white ">
                        Our platform now features an  AI-powered annotation tool that automatically annotates the sentences in your uploaded files. As soon as you upload a task, the AI quickly processes and provides initial annotations, helping you save time and effort. You can then review, adjust, and finalize the annotations with ease, making the overall workflow faster, smarter, and more efficient.
                    </p>
                </div>

            </div>
            <Footer />
        </div>
    )
}
