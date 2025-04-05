
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, useTheme, useMediaQuery, IconButton, MobileStepper } from '@mui/material';
import UploadFileFormStepper from '../../components/UploadFileFormStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import '../../components/style_modules/styles.css'

export default function UploadAnnotationDialog({ dialogOpenState, setDialogOpenState }) {

    const theme = useTheme()
    const isWideScreen = useMediaQuery(theme.breakpoints.down('md'))

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClose = () => {
        setDialogOpenState(false)
        setActiveStep(0)
    };

    return (
        <>
            <Dialog
                fullScreen={isWideScreen}
                open={dialogOpenState}
                onClose={handleClose}
                sx={{ backdropFilter: 'blur(10px)' }}
            >
                <DialogContent style={{ backgroundColor: '#f1faee', position: 'relative' }}>
                    <IconButton
                        onClick={handleClose}
                    >
                        <ClearOutlinedIcon fontSize='large' />
                    </IconButton>

                    <div>
                        <h1 className='center-text'>Create Annotation Task</h1>
                        <p className='margin-6px gray-color'>
                            To create a new task, please fill out the fields below correctly and upload your dataset file
                        </p>
                    </div>

                    <UploadFileFormStepper activeStep={activeStep} />
                    <p className='margin-6px' style={{ display: activeStep == 1 ? 'none' : "" }}>
                        After you fill out the fields, proceed to the next step by clicking the "NEXT" button below
                    </p>
                </DialogContent>
                <DialogActions>
                    <MobileStepper
                        variant='dots'
                        steps={2}
                        position="static"
                        activeStep={activeStep}
                        sx={{ flexGrow: 1 }}
                        nextButton={
                            <Button sx={{ backgroundColor: 'var(--dark-bg)' }} size="small" onClick={handleNext} disabled={activeStep === 1} variant='contained' color='success'>
                                NEXT
                                <KeyboardArrowRight />

                            </Button>
                        }
                        backButton={
                            <Button sx={{ backgroundColor: 'var(--dark-bg)' }} size="small" onClick={handleBack} disabled={activeStep === 0} variant='contained' color='success'>
                                <KeyboardArrowLeft />
                                Back
                            </Button>
                        }
                    />
                </DialogActions>
            </Dialog>
        </>
    );
}
