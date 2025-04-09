import styles from './style_modules/InputText.module.css'
import Tooltip from '@mui/material/Tooltip';
import { TextField, InputAdornment } from '@mui/material';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const borderFocusStyleProps = {

    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: 'var(--dark-bg)',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'gray',
    },
    backgroundColor: 'inherit'
}
function InputSelect({ required, type, title = null, name, id, value, validation_error, changeHandler, blurHandler = null, menuItems }) {

    return (
        <>
            <div className={`${styles.inputText}`}>
                <Tooltip title={`Enter ${title}`}>
                    <FormControl required={required} fullWidth
                        sx={{ ...borderFocusStyleProps }}
                        error={validation_error}
                        size='small'

                    >
                        <InputLabel id={id}>{title}</InputLabel>
                        <Select
                            labelId={id}
                            label={title}
                            key="ddd"
                            required={required}
                            value={value}
                            id={id}
                            name={name}
                            onChange={changeHandler}
                            onBlur={(event) => blurHandler(event, title, required)}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        color: 'var(--dark-bg)',             // dropdown text color
                                        '& .MuiMenuItem-root:hover': {
                                            bgcolor: 'var(--dark-bg)',
                                            color: 'white'    // hover color for all items
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="" sx={{ color: 'gray' }}>
                                Select annotation type
                            </MenuItem>
                            {menuItems.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>


                    </FormControl>
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

export default InputSelect