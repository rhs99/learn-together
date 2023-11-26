import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem, Stack, Typography, Box, Card, CardContent, CardActions } from '@mui/material';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AuthContext from '../../store/auth';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Util from '../../utils';
import Popover from '@mui/material/Popover';
import Icon from '../../design-library/Icon';
import Button from '../../design-library/Button';

import './_index.scss';

const Navigation = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotification, setAnchorElNotification] = useState<HTMLButtonElement | null>(null);

  const [notifications, setNotifications] = useState<string[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const authCtx = useContext(AuthContext);
  const { isLoggedIn, getStoredValue } = authCtx;
  const navigate = useNavigate();

  const open = Boolean(anchorElNotification);
  const id = open ? 'simple-popover' : undefined;
  const currUserName = authCtx.getStoredValue().userName;

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const socket = new WebSocket(`ws://localhost:5000?userName=${currUserName}`);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
      console.log(event.data);
      setHasNewNotification(true);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      socket.close();
    };
  }, [isLoggedIn, currUserName]);

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
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${getStoredValue().userName}/notifications`;
    axios.get(URL).then(({ data }) => {
      setNotifications(data);
    });
  };

  const handleNotificationFetch = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElNotification(event.currentTarget);
    await fetchNotifications();
    setHasNewNotification(false);
  };

  const handleNotificationClose = () => {
    setAnchorElNotification(null);
  };

  const goToQuestion = (qId: string) => {
    setAnchorElNotification(null);
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${getStoredValue().userName}/notifications/${qId}`;
    axios.delete(URL).then(() => {
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
        <div className="gap">
          <NavLink
            to="/about"
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
          >
            About
          </NavLink>
        </div>
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
          <div className="gap">
            <NavLink
              className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
              to="/users/signup"
            >
              Signup
            </NavLink>
          </div>
        )}
        {isLoggedIn && (
          <>
            <Icon onClick={handleNotificationFetch} name="notification" size={18} />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorElNotification}
              onClose={handleNotificationClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box>
                {notifications.map((notification) => {
                  return (
                    <Card key={notification} sx={{ margin: '5px 10px', width: '250px' }}>
                      <CardContent sx={{ padding: '5px' }}>
                        <Typography>Your question got a new answer!</Typography>
                      </CardContent>
                      <CardActions sx={{ padding: '0' }}>
                        <Button onClick={() => goToQuestion(notification)}>Check here</Button>
                      </CardActions>
                    </Card>
                  );
                })}
                {notifications.length === 0 && <Typography sx={{ padding: '10px' }}>No notifications</Typography>}
              </Box>
            </Popover>
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
                  <Icon name="profile" size={16} />
                  <Typography variant="body1">Profile</Typography>
                </Stack>
              </MenuItem>
              <MenuItem onClick={goToSettings}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Icon name="settings" size={16} />
                  <Typography variant="body1">Settings</Typography>
                </Stack>
              </MenuItem>
              <MenuItem onClick={logoutHandler}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Icon name="logout" size={16} />
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
