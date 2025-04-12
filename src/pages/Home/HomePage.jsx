import { Grid2 as Grid, Typography, Button } from "@mui/material"
import { useMediaQuery, useTheme } from '@mui/material';
import SigninForm from "../../components/SigninForm";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import QuickDialog from "../../components/Dialog";
import NavigationBar from "../../components/NavigationBar";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Loader from "../../components/Loader";

const quickActionButtonProps = {
    margin: 2,
    borderRadius: '0px',
    textTransform: 'none',
    padding: 1,
    width: '300px',
    fontSize: '18px',
}
export default function HomePage() {

    const navigate = useNavigate()
    const ref = useRef()
    const theme = useTheme()
    const isWideScreen = useMediaQuery(theme.breakpoints.up('md'))

    const [dialogOpenState, setDialogOpenState] = useState(false)
    const [component, setComponent] = useState(<SigninForm />)

    // handle Get Started button -> open the form of the task creation
    const getStarted = () => {
        if (localStorage.getItem('ACCESS_TOKEN')) {
            navigate('/dashboard/overview')
        }
        else {
            setDialogOpenState(true)

        }
    }

    return (
        <div ref={ref}>
            <div
                className='text-white flex flex-centered-items flex-column-items white-text center-text home-img-container'
                size={12}
                style={{
                    height: `${isWideScreen ? '90vh' : '70vh'}`,
                    position: 'relative'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '0px',
                    width: '100%'
                }}>
                    <NavigationBar />
                </div>

                <Typography fontWeight={700}
                    variant={isWideScreen ? 'h2' : 'h4'}
                    sx={{color: 'white'}}
                >
                    Streamline Your Data with Our Text Annotation Tool
                </Typography>

                <Typography
                    variant={isWideScreen ? 'h6' : 'body2'}
                    marginTop={1}
                    sx={{color: 'white'}}
                >
                    Easily upload your files and classify words with precision
                </Typography>
                <Typography
                    variant={isWideScreen ? 'h6' : 'body2'}
                    sx={{color: 'white'}}
                >
                    Our intuitive tool simplifies annotation, helping you organize and analyze text effortlessly. Start streamlining your data today!
                </Typography>
                <div>
                    <Button
                        id="quick-action-button"
                        variant="contained"
                        sx={{ ...quickActionButtonProps }}
                        onClick={getStarted}
                        endIcon={
                            <ArrowForwardIcon className="arrow-icon" fontSize='large' />
                        }
                    >
                        Get started
                    </Button>
                    <QuickDialog
                        openState={dialogOpenState}
                        setOpenState={setDialogOpenState}
                        component={component} />
                </div>
            </div>
        </div>
    )
}