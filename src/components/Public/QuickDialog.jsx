
import { useState } from 'react';
import { Tooltip, Dialog, DialogContent, IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import clsx from 'clsx'

export default function QuickDialog({ openState, setOpenState, component }) {

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
                <DialogContent className=''>
                    <IconButton
                        onClick={handleClose}
                    >
                        <ClearOutlinedIcon fontSize='small' />
                    </IconButton>
                    <Tooltip title={fullScreen ? 'Minimize' : 'Maximize'}>
                        <IconButton
                            onClick={() => setFullScreen(!fullScreen)}
                        >
                            {fullScreen ? <FullscreenExitIcon fontSize='small' /> : <FullscreenIcon fontSize='small' />}
                        </IconButton>
                    </Tooltip>

                    <div className={clsx('flex justify-center items-center overflow-auto')}>
                        <div className={clsx(fullScreen ? 'shadowed ' : '')}>
                            {component}
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    );
}
