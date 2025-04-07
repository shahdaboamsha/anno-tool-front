
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, useTheme, useMediaQuery, IconButton, MobileStepper } from '@mui/material';
import UploadFileFormStepper from './UploadFileFormStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import './style_modules/styles.css'

export default function QuickDialog({ openState, setOpenState, component }) {

    const theme = useTheme()
    const isWideScreen = useMediaQuery(theme.breakpoints.down('md'))

    const handleClose = () => {
        setOpenState(false)
    };

    return (
        <>
            <Dialog
                fullScreen={isWideScreen}
                open={openState}
                onClose={handleClose}
                sx={{ backdropFilter: 'blur(10px)' }}
            >
                <DialogContent >
                    <IconButton
                        onClick={handleClose}
                    >
                        <ClearOutlinedIcon fontSize='small' />
                    </IconButton>

                    {component}

                </DialogContent>
            </Dialog>
        </>
    );
}
