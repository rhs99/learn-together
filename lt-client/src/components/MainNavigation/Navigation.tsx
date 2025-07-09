import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../../store/auth';
import Util from '../../utils';

import { IoIosNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { ImProfile } from 'react-icons/im';
import { IoSettingsOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';

import {
  Box,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@optiaxiom/react';

import './_index.scss';

const Navigation = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const authCtx = useContext(AuthContext);
  const { isLoggedIn, getStoredValue } = authCtx;
  const currUserName = authCtx.getStoredValue().userName;

  const navigate = useNavigate();

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

  const logoutHandler = () => {
    authCtx.logout();
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/users/' + authCtx.getStoredValue().userName);
  };

  const goToSettings = () => {
    navigate('/users/' + authCtx.getStoredValue().userName + '/settings');
  };

  const fetchNotifications = async () => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${getStoredValue().userName}/notifications`;
    axios.get(URL).then(({ data }) => {
      setNotifications(data);
    });
  };

  const handleNotificationFetch = async () => {
    await fetchNotifications();
    setHasNewNotification(false);
  };

  const handleGoToNotification = (value: string) => {
    if (value.length === 0) {
      return;
    }
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${getStoredValue().userName}/notifications/${value}`;
    axios.delete(URL).then(() => {
      navigate(`/questions/${value}`);
    });
  };

  const getNotificationOption = () => {
    if (notifications.length === 0) {
      return [{ value: '', component: <span>No Notification!</span> }];
    }
    const options = notifications.map((notification) => {
      const option = {
        component: <span>New answer!</span>,
        value: notification,
      };
      return option;
    });
    return options;
  };

  return (
    <Box className="lt-Navigation">
      <Box className="left">
        <NavLink
          to="/"
          className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
          end
        >
          Home
        </NavLink>
        <Box className="gap">
          <NavLink
            to="/about"
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
          >
            About
          </NavLink>
        </Box>
        <Box className="gap">
          <NavLink
            to="/donate"
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
          >
            Donate
          </NavLink>
        </Box>
      </Box>
      <Box className={isLoggedIn ? 'right-loggedIn' : 'right'}>
        {!isLoggedIn && (
          <NavLink
            to="/users/login"
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
          >
            Login
          </NavLink>
        )}
        {!isLoggedIn && (
          <Box className="gap">
            <NavLink
              className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
              to="/users/signup"
            >
              Signup
            </NavLink>
          </Box>
        )}
        {isLoggedIn && (
          <Box>
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={handleNotificationFetch}
                icon={<IoIosNotificationsOutline color={hasNewNotification ? 'red' : 'black'} />}
              />
              <DropdownMenuContent>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {getNotificationOption().map((option) => (
                  <DropdownMenuItem key={option.value} onClick={() => handleGoToNotification(option.value)}>
                    {option.component}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger icon={<CgProfile />} />
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={goToProfile}>
                  <ImProfile /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={goToSettings}>
                  <IoSettingsOutline /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logoutHandler}>
                  <CiLogout /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navigation;
