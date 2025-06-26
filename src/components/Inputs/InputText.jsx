import Tooltip from '@mui/material/Tooltip';
import { TextField, InputAdornment } from '@mui/material';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import clsx from 'clsx';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function InputText({ size = "small",
    mutiline = false,
    required,
    type, title = null,
    placeholder,
    name,
    id,
    value,
    validation_error,
    changeHandler,
    startIcon = null,
    autoFocus = false,
    widthDetection = true
}) {
const borderFocusStyleProps = {

        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: widthDetection ? ( value.toLocaleString().trim() === "" ? 'var(--dark-bg)' : (validation_error  ? 'red' : 'green')) : "",
            },
            '& fieldset': {
                borderColor: widthDetection? (value.toLocaleString().trim() === ""? 'rgba(0, 0, 0, 0.23)' : (validation_error ? 'red' : 'green')) : ""
            }
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'gray',
        },
        backgroundColor: 'inherit',
       
}
    return (
        <>
            <div className={clsx('flex flex-col relative',  validation_error? 'mb-1' : 'mb-1')} style={{ width: '100%' }}>
                <Tooltip title={`Enter ${title}`}>
                    <TextField
                        required={required}
                        fullWidth
                        multiline={mutiline}
                        autoFocus={autoFocus}
                        size={size}
                        id={id}
                        placeholder={placeholder || title}
                        label={title}
                        variant="outlined"
                        type={type}
                        onChange={changeHandler}
                        name={name}
                        value={value}
                        error={validation_error}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {widthDetection? (validation_error? <ReportOutlinedIcon fontSize='small' color="error" /> : (value !== "" &&  <CheckCircleOutlineIcon fontSize='small' color='success' />)) : ""}
                                </InputAdornment>
                            ),
                            startAdornment: startIcon
                        }}
                        sx={{ ...borderFocusStyleProps }}
                    />
                </Tooltip>

                <span className='text-red-600 text-[12px] text-left m-0 p-0' style={{ marginLeft: '5px' }}>
                    {validation_error}
                </span>

                <script>

                </script>
            </div>

        </>
    )
}

export default InputText