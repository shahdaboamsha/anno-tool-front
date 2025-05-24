import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import clsx from 'clsx';


function InputSelect({
    required,
    title = null,
    name, id,
    value,
    validation_error,
    changeHandler,
    menuItems,
    withDetection = true
}) {
    const borderFocusStyleProps = {

        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: withDetection ? (value.trim() === "" ? 'var(--dark-bg)' : (validation_error ? 'red' : 'green')) : "",
            },
            '& fieldset': {
                borderColor: withDetection ? (value.trim() === "" ? 'rgba(0, 0, 0, 0.23)' : (validation_error ? 'red' : 'green')) : ""
            }
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'gray',
        },
        backgroundColor: 'inherit',

    }
    return (
        <>
            <div className={clsx('w-full flex flex-col',  validation_error? 'mb-0' : 'mb-1')}>
                <Tooltip title={`Enter ${title}`}>
                    <FormControl required={required} fullWidth
                        sx={{ ...borderFocusStyleProps }}
                        error={validation_error}
                        size='small'
                    >
                        <InputLabel id={id}>{title}</InputLabel>
                        <Select
                            fullWidth
                            labelId={id}
                            label={title}
                            key="ddd"
                            required={required}
                            value={value}
                            id={id}
                            name={name}
                            onChange={changeHandler}
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
                            <MenuItem value="" defaultChecked>
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
                <span className='text-red-600 text-[12px] text-left m-0 p-0' style={{ marginLeft: '5px' }}>
                    {validation_error}
                </span>

                <script>

                </script>
            </div>

        </>
    )
}

export default InputSelect