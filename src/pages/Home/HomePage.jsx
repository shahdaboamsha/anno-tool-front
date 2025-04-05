import { Grid2 as Grid, Typography, Button } from "@mui/material"
import { useMediaQuery, useTheme } from '@mui/material';
import UploadAnnotationDialog from "../Upload Annotaion/UploadAnnotationDialog";
import { useState } from "react";

const quickActionButtonProps = {
    margin: 2,
    bgcolor: 'white',
    color: 'black',
    outline: 'none',
    border: 'none',
    borderRadius: '0px',
    textTransform: 'none',
    padding: 1,
    width: '300px',
    fontSize: '18px',
    '&:hover': {
        bgcolor: 'var(--dark-bg)',
        color: 'white'
    }
}
export default function HomePage() {

    const theme = useTheme()
    const isWideScreen = useMediaQuery(theme.breakpoints.up('md'))

    const [dialogOpenState, setDialogOpenState] = useState(false)

    // handle Get Started button -> open the form of the task creation
    const getStarted = () => {
        setDialogOpenState(true)
    }
    return (
        <div>
            <div
                className='flex flex-centered-items flex-column-items white-text center-text home-img-container'
                size={12}
                style={{
                    height: `${isWideScreen ? '90vh' : '70vh'}`
                }}
            >
                <Typography fontWeight={700}
                    variant={isWideScreen ? 'h2' : 'h4'}
                >
                    Streamline Your Data with Our Text Annotation Tool
                </Typography>

                <Typography variant='subtitle2' marginTop={1}>
                    Easily upload your files and classify words with precision
                </Typography>
                <Typography variant='subtitle2'>
                    Our intuitive tool simplifies annotation, helping you organize and analyze text effortlessly. Start streamlining your data today!
                </Typography>
                <div>
                    <Button
                        id="quick-action-button"
                        variant="contained"
                        sx={{ ...quickActionButtonProps }}
                        onClick={getStarted}
                    >
                        Annotate Your Text
                    </Button>
                    <UploadAnnotationDialog dialogOpenState={dialogOpenState} setDialogOpenState={setDialogOpenState}/>
                </div>
            </div>
        </div>
    )
}