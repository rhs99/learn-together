import { NavLink, redirect } from 'react-router-dom';
import { useContext } from 'react';
import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Button from '@mui/material/Button';
import AuthContext from '../../store/auth';

import './_index.scss';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;

  const logoutHandler = () => {
    authCtx.logout();
    redirect('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Stack direction="row" spacing={2}>
            <SchoolRoundedIcon fontSize="large" />
            <NavLink
              to="/"
              className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
            >About</NavLink>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mr: 2, ml: 'auto' }}>
            {!isLoggedIn && <NavLink to="/users/login">Login</NavLink>}
            {!isLoggedIn && <NavLink to="/users/signup">Signup</NavLink>}
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Logout
              </Button>
            )}
            <AccountCircleRoundedIcon fontSize="large" />
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default MainNavigation;
