import styles from './style_modules/InputText.module.css'
import { Button, colors } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './style_modules/styles.css'
import { Tooltip } from '@mui/material';
import { useState } from 'react';
import { Typography } from '@mui/material';

const ButtonStyleProps = {
    textTransform: 'none',
    fontWeight: '400',
    display: 'flex',
    flexDirection: 'column',
    color: 'inherit',
}

export default function InputFile({ fileSelectionHandler, loadingState, validation_error }) {

    return (
        <div className={`${styles.inputText}`}>
            <Tooltip title='Upload dataset' placement='bottom'>
                <input
                    onChange={fileSelectionHandler}
                    type="file"
                    name="dataSetFile"
                    id="dataInput"
                    hidden
                    accept=".csv, .xlsx" />
                <Button
                    size="small"
                    fullWidth
                    variant="outlined"
                    sx={{
                        ...ButtonStyleProps,
                        borderColor: validation_error === "" ? 'inherit' : 'red',
                        '&.MuiButton-outlined': {
                            borderColor: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? theme.palette.grey[600]
                                    : (validation_error === "" ? 'inherit' : 'red'),
                        },
                    }}
                    onClick={() => document.getElementById('dataInput')?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={fileSelectionHandler}
                    loading={loadingState === "loading"}
                >
                    <CloudUploadIcon fontSize="large" color="action" />
                    <Typography className="text-[20px] dark:text-white" variant="body1">
                        Upload a file by browsing or dragging and dropping
                    </Typography>
                </Button>

                <span style={{
                    whiteSpace: 'pre-line',
                    marginLeft: '10px',
                    color: 'red',
                    fontSize: '12px',

                }}>
                    {validation_error}
                </span>
            </Tooltip>

        </div>
    )
}