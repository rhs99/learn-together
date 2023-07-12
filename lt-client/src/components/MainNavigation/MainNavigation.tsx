import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthContext from '../../store/auth';

import './_index.scss';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  const logoutHandler = () => {
    authCtx.logout();
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/profile/' + authCtx.getStoredValue().userName);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ boxShadow: '0 0 0 0' }}>
        <Toolbar sx={{ backgroundColor: 'rgb(231, 235, 240)' }}>
          <Stack direction="row" spacing={2}>
            <NavLink
              to="/"
              className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
            >
              About
            </NavLink>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mr: 2, ml: 'auto' }}>
            {!isLoggedIn && (
              <NavLink
                to="/users/login"
                className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
              >
                Login
              </NavLink>
            )}
            {!isLoggedIn && (
              <NavLink
                className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
                to="/users/signup"
              >
                Signup
              </NavLink>
            )}
            {isLoggedIn && (
              <>
                <IconButton onClick={handleOpenUserMenu}>
                  <AccountCircleRoundedIcon sx={{ color: 'primary' }} fontSize="medium" />
                </IconButton>
                <Menu
                  sx={{ mt: '35px' }}
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
                  <MenuItem onClick={goToProfile}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <PersonOutlineIcon />
                      <Typography variant="body1">Profile</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem onClick={logoutHandler}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <LogoutIcon />
                      <Typography variant="body1">Logout</Typography>
                    </Stack>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MainNavigation;
