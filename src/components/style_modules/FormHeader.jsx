import { Typography } from "@mui/material"
export default function FormHeader({ title, text, start = null }) {
    return (
        <div>
            <Typography variant="h5" className={`${start ? 'text-start' : 'text-center'} dark:text-white`}>{title}</Typography>
            <p className="form-header-desc" style={{textAlign: start?'start' : 'center'}}>{text}</p>
        </div>
    )
}