import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthContext from '../../store/auth';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Util from '../../utils';
import Drawer from '@mui/material/Drawer';

import './_index.scss';

const Navigation = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const authCtx = useContext(AuthContext);
  const { isLoggedIn, getStoredValue } = authCtx;
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = () => {
    authCtx.logout();
    setAnchorElUser(null);
    navigate('/');
  };

  const goToProfile = () => {
    setAnchorElUser(null);
    navigate('/users/' + authCtx.getStoredValue().userName);
  };

  const goToSettings = () => {
    setAnchorElUser(null);
    navigate('/users/' + authCtx.getStoredValue().userName + '/settings');
  };

  const fetchNotifications = async () => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/notifications?userName=${getStoredValue().userName}`;
    axios.get(URL).then(({ data }) => {
      setNotifications(data);
      setShowNotifications(true);
    });
  };

  const goToQuestion = (qId: string) => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${getStoredValue().userName}/notifications/${qId}`;
    axios.delete(URL).then(() => {
      setShowNotifications(false);
      navigate(`/questions/${qId}`);
    });
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
            <IconButton onClick={fetchNotifications}>
              <NotificationsNoneIcon />
            </IconButton>
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
              <MenuItem onClick={goToSettings}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <SettingsIcon />
                  <Typography variant="body1">Settings</Typography>
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
      <Drawer anchor="right" open={showNotifications} onClose={() => setShowNotifications(false)}>
        <Box>
          {notifications.map((notification) => {
            return (
              <Card key={notification} sx={{ margin: '5px 10px' }}>
                <CardContent sx={{ padding: '5px' }}>
                  <Typography>Your question got a new answer!</Typography>
                </CardContent>
                <CardActions sx={{ padding: '0' }}>
                  <Button onClick={() => goToQuestion(notification)}>Check here</Button>
                </CardActions>
              </Card>
            );
          })}
          {notifications.length === 0 && (
            <Card sx={{ margin: '5px 10px' }}>
              <CardContent>
                <Typography>No notifications</Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default Navigation;
