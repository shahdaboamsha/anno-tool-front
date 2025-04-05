
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import './style_modules/styles.css'
import { useTheme, useMediaQuery } from '@mui/material';

const pages = ['Home', 'About us', 'create task']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

function NavigationBar() {

    const theme = useTheme()

    // check if the screen is wide (laptops, pc) 
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" color='default' sx={{ bgcolor: 'var(--dark-bg)' }}>
            <Container maxWidth="xl"  >
                <Toolbar disableGutters style={{ height: '80px' }} className='flex flex-spacearound flex-row flex-center-align'>
                    {/** for small devices */}
                    {isSmallScreen && <>
                        <div>
                            <IconButton
                                size="large"
                                onClick={handleOpenNavMenu}
                                sx={{ color: 'white' }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                marginThreshold={1}
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            width: '100%',
                                            height: isSmallScreen ? '100vh' : 'initial',
                                            maxWidth: '100%',
                                            left: '0px',
                                            right: '0px',
                                        },
                                    }
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu} sx={{ width: '100%' }}>
                                        <a href="" className='nav-link-menu-items'>{page}</a>
                                    </MenuItem>
                                ))}
                            </Menu>

                        </div>
                        <div className='logo'>
                            <h2 >
                                <a href="/" className='nav-link'>
                                    <img src='src\assets\icons\humanoid.png' width='40px' alt="" />
                                </a>
                            </h2>
                        </div>
                    </>
                    }
                    {/** for wide screens */}
                    {!isSmallScreen && <>
                        <div>
                            <a href="/" className='nav-link logo-link'>
                                <img src='src\assets\icons\humanoid.png' width='40px' alt="" />
                            </a>
                            <a href="/" className='nav-link'>Home</a>
                            <a href="" className='nav-link'>About us</a>
                        </div>
                    </>
                    }

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default NavigationBar;
