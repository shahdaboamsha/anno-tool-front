import '../style_modules/animatedButton.css'
import StartIcon from '@mui/icons-material/Start';

export default function AnimatedButton({ onClick, icon }) {

    return (
        <button className="button" style={{float: 'right'}} onClick={onClick}>
            <StartIcon className='svgIcon' />
        </button>

    )
}