import { Button, useMediaQuery, useTheme, Typography, IconButton } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { UserContext } from "./DashboardLayout";
import { useContext } from "react";

const formatUserName = (str) => {
    const capitalizeFirstLetter = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }
    const splittedStr = str.split(" ")
    return splittedStr.map(word => capitalizeFirstLetter(word)).join(" ")
}

export default function UserCard({ setOpen, closeUserPopover }) {

    const {userData} = useContext(UserContext)
    
    const navigate = useNavigate()
    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('sm'))

    const signout = () => {
        localStorage.removeItem('ACCESS_TOKEN')
        navigate('/signin')
    }
    return (
        <div className={`p-10 bg-gray-200 flex flex-column-items flex-centered-items }`}>
                <div onClick={() => { navigate('overview'); setOpen(false) }}>
                    <Avatar
                        src={localStorage.getItem('USER_PROFILE_IMAGE')}
                        alt=""
                        sx={{ width: 100, height: 100, margin: 'auto', cursor: 'pointer' }}
                    />
                </div>


                <Typography sx={{ margin: '10px', display: 'block' }} variant={!isSmallScreen ? 'h5' : 'h6'}>
                    {formatUserName(userData.userName)}
                </Typography>

                <Button
                size='medium'
                variant="contained"
                color='success'
                onClick={() => {closeUserPopover(); navigate('account')}}
                endIcon={<SettingsIcon color='inherit' />}
                sx={{ textTransform: 'none', color: 'white'}}>Manage your account</Button>

            <Button
                size='medium'
                variant="outlined"
                color='error'
                endIcon={<LogoutIcon color='inherit' />}
                onClick={signout}
                sx={{ textTransform: 'none', color: 'red', m: 2 }}>Sign out</Button>

        </div>
    )
}