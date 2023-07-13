import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthContext from '../../store/auth';

import './_index.scss';

const Navigation = () => {
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
    setAnchorElUser(null);
    navigate('/');
  };

  const goToProfile = () => {
    setAnchorElUser(null);
    navigate('/users/' + authCtx.getStoredValue().userName);
  };

  return (
    <div className="lt-Navigation">
      <div className="left">
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
      </div>
      <div className={isLoggedIn ? 'right-loggedIn' : 'right'}>
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
              sx={{ mt: '20px' }}
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
      </div>
    </div>
  );
};

export default Navigation;
