import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Tooltip from '@mui/material/Tooltip';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import clsx from 'clsx';
import dayjs from 'dayjs';

export default function InputDate({
  size = "small",
  required,
  title,
  placeholder,
  name,
  id,
  value,
  validation_error,
  changeHandler,
  autoFocus = false,
}) {
  const borderFocusStyleProps = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: value?.trim?.() === "" ? 'var(--dark-bg)' : (validation_error ? 'red' : 'green'),
      },
      '& fieldset': {
        borderColor: value?.trim?.() === "" ? 'rgba(0, 0, 0, 0.23)' : (validation_error ? 'red' : 'green'),
      }
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'gray',
    },
    backgroundColor: 'inherit',
  };

  return (
    <div className={clsx('flex flex-col relative', validation_error ? 'mb-0' : 'mb-1')} style={{ width: '100%' }}>
      <Tooltip title={`Enter ${title}`}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={value ? dayjs(value) : null}
            onChange={(newValue) => {
              changeHandler({ target: { name, value: newValue ? newValue.format('YYYY-MM-DD') : '' } });
            }}
            sx={{ width: '100%', ...borderFocusStyleProps }}
            slotProps={{
              textField: {
                id: id,
                name: name,
                required: required,
                placeholder: placeholder || title,
                label: title,
                variant: "outlined",
                fullWidth: true,
                size: size,
                autoFocus: autoFocus,
                error: !!validation_error,
              }
            }}
          />
        </LocalizationProvider>
      </Tooltip>

      {validation_error && (
        <span className="text-red-600 text-[12px] text-left m-0 p-0" style={{ marginLeft: '5px' }}>
          {validation_error}
        </span>
      )}
    </div>
  );
}
