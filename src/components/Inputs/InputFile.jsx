import { Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../style_modules/styles.css'
import { Tooltip } from '@mui/material';
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
        <div className='flex flex-col'>
            <Tooltip title='Upload dataset' placement='bottom'>
                <input
                    onChange={fileSelectionHandler}
                    type="file"
                    name="dataSetFile"
                    id="dataInput"
                    hidden
                    accept=".csv, .xlsx" />
                <Button
                    size="large"
                    fullWidth
                    variant="outlined"
                    sx={{
                        ...ButtonStyleProps,
                        color: 'black',
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
                    <Typography className="text-[20px]" variant="body1">
                        Upload a file by browsing or dragging and dropping
                    </Typography>
                </Button>

                <span className='text-red-600 text-[12px] text-left p-0 m-0' style={{marginRight: '5px'}}>
                    {validation_error}
                </span>
            </Tooltip>

        </div>
    )
}