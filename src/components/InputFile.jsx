import styles from './style_modules/InputText.module.css'
import { Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './style_modules/styles.css'
import { Tooltip } from '@mui/material';
const ButtonStyleProps = {
    textTransform: 'none',
    fontWeight: '400',
    display: 'flex',
    flexDirection: 'column',
    color: 'black',
    backgroundColor: 'white'
}

export default function InputFile({ fileSelectionHandler, loadingState }) {

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
                    size='large'
                    fullWidth
                    color='#ff8fab'
                    variant='outlined'
                    sx={{
                        ...ButtonStyleProps,
                        borderColor: 'var(--dark-bg)',
                    }}
                    onClick={() => document.getElementById('dataInput').click()}     
                    onDragOver={(e) => e.preventDefault()}            
                    onDrop={fileSelectionHandler}
                    loading={loadingState == "loading"}
                >
                    <CloudUploadIcon fontSize='large' color='action' />
                    <h3>Upload a file by browsing or dragging and dropping</h3>
                </Button>
            </Tooltip>

        </div>
    )
}