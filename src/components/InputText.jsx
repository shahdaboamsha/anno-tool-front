import styles from './style_modules/InputText.module.css'
import Tooltip from '@mui/material/Tooltip';
import { TextField, InputAdornment } from '@mui/material';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';


const borderFocusStyleProps = {

    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'var(--dark-bg)',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'gray',
    },
    backgroundColor: 'white'
}

function InputText({ required, type, title = null, placeholder, name, id, value, validation_error, changeHandler, blurHandler = null }) {

    const handeBlur = (event) => {
        const { value } = event.target

        if (value.trim() == ""){
            validation_error = ""
        }
    }
    return (
        <>
            <div className={`${styles.inputText}`}>
                <Tooltip title={`Enter ${title || id}`}>
                    <TextField
                        required={required}
                        size='small'
                        id={id}
                        placeholder={placeholder || title}
                        label={title}
                        variant="outlined"
                        type={type}
                        onChange={changeHandler}
                        onBlur={event => blurHandler(event, title, required)}
                        name={name}
                        value={value}
                        error={validation_error}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {validation_error && <ReportOutlinedIcon fontSize='small' color="error" />}
                                </InputAdornment>
                            ),
                        }}
                        sx={{...borderFocusStyleProps}}
                    />
                </Tooltip>

                <span className={styles.inputValidationErrorSpan} style={{ whiteSpace: 'pre-line', marginLeft: '10px' }}>
                    {validation_error}
                </span>

                <script>

                </script>
            </div>

        </>
    )
}

export default InputText