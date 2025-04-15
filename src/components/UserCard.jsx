import { Button, useMediaQuery, useTheme, Typography, IconButton } from "@mui/material"
import { useState } from "react"
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

export default function UserCard({ setOpen }) {
    const navigate = useNavigate()
    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('sm'))

    localStorage.setItem('USER_PROFILE_IMAGE', 'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg')
    localStorage.setItem('USER_NAME', 'Jhon Mark')

    const signout = () => {
        localStorage.removeItem('ACCESS_TOKEN')
        localStorage.removeItem('USER_PROFILE_IMAGE')
        localStorage.removeItem('USER_NAME')
        navigate('/signin')
    }
    return (
        <div className={`p-10 bg-gray-200 flex flex-column-items flex-centered-items }`}>
                <div onClick={() => { navigate('overview'); setOpen(false) }}>
                    <Avatar
                        className="card-profile-image" src={localStorage.getItem('USER_PROFILE_IMAGE')}
                        alt=""
                        sx={{ width: 100, height: 100, margin: 'auto', cursor: 'pointer' }}
                    />
                </div>


                <Typography sx={{ margin: '10px', display: 'block' }} variant={!isSmallScreen ? 'h5' : 'h6'}>
                    {localStorage.getItem('USER_NAME')}
                </Typography>

                <Button
                size='medium'
                variant="contained"
                color='success'
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