import { Typography } from "@mui/material"
export default function FormHeader({ title, text }) {
    return (
        <div>
            <Typography sx={{mt: 4}} variant="h4" className="text-center m-9 dark:text-white">{title}</Typography>
            <p className="form-header-desc">{text}</p>
        </div>
    )
}