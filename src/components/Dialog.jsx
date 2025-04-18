
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, useTheme, useMediaQuery, IconButton, MobileStepper } from '@mui/material';
import UploadFileFormStepper from './UploadFileFormStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import './style_modules/styles.css'
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Tooltip } from '@mui/material';

export default function QuickDialog({ openState, setOpenState, component }) {

    const theme = useTheme()

    const [fullScreen, setFullScreen] = useState(false)
    const handleClose = () => {
        setOpenState(false)
    };

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={openState}
                onClose={handleClose}
                sx={{ backdropFilter: 'blur(10px)' }}
            >
                <DialogContent>
                    <IconButton
                        onClick={handleClose}
                    >
                        <ClearOutlinedIcon fontSize='small' />
                    </IconButton>
                    <Tooltip title={fullScreen? 'Minimize' : 'Maximize'}>
                    <IconButton
                        onClick={() => setFullScreen(!fullScreen)}
                    >
                        {fullScreen ? <FullscreenExitIcon fontSize='small' /> : <FullscreenIcon fontSize='small' />}
                    </IconButton>
                </Tooltip>
                {component}

            </DialogContent>
        </Dialog >
        </>
    );
}
