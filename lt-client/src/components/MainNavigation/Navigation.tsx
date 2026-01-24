import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../store/auth';
import Util from '../../utils';
import { useTheme } from '../../hooks/use-theme';

import { IoIosNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { ImProfile } from 'react-icons/im';
import { IoSettingsOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

import {
  Box,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Text,
} from '@optiaxiom/react';

import './_index.scss';

type Notification = {
  _id: string;
  type: string;
  details: string;
};

const Navigation = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const authCtx = useContext(AuthContext);
  const { isLoggedIn, getStoredValue } = authCtx;
  const currUserName = authCtx.getStoredValue().userName;
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const socket = new WebSocket(`${Util.CONSTANTS.WEBSOCKET_URL}?userName=${currUserName}`);

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

  const handleGoToNotification = (questionId: string, notificationId: string) => {
    if (questionId.length === 0 || notificationId.length === 0) {
      return;
    }
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${getStoredValue().userName}/notifications/${notificationId}`;
    axios.delete(URL).then(() => {
      navigate(`/questions/${questionId}`);
    });
  };

  const getNotificationOption = () => {
    if (notifications.length === 0) {
      return [{ value: '', component: <Text color="fg.tertiary">No Notification!</Text> }];
    }
    const options = notifications.map((notification) => {
      const option = {
        component: (
          <Text
            color="fg.accent.hovered"
            onClick={() => handleGoToNotification(notification.details, notification._id)}
            style={{ cursor: 'pointer' }}
          >
            New answer!
          </Text>
        ),
        value: notification._id,
      };
      return option;
    });
    return options;
  };

  return (
    <Box
      className="lt-Navigation"
      display="flex"
      justifyContent="space-between"
      h="64"
      w="full"
      bg="bg.default"
      borderB="2"
      shadow="sm"
      px="24"
    >
      <Box display="flex" flexDirection="row" alignItems="center" gap="8">
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
        <NavLink
          to="/donate"
          className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
        >
          Donate
        </NavLink>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" gap={isLoggedIn ? '12' : '8'}>
        <Button
          appearance="subtle"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          icon={theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
          onClick={toggleTheme}
          size="md"
        />
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
          <Box display="flex" flexDirection="row" gap="8">
            <Popover>
              <PopoverTrigger
                aria-label="Notifications"
                icon={
                  <IoIosNotificationsOutline
                    color={hasNewNotification ? '#EF4444' : theme === 'dark' ? '#F1F5F9' : '#2E3442'}
                  />
                }
                onClick={handleNotificationFetch}
              />
              <PopoverContent>
                {getNotificationOption().map((option, index) => (
                  <React.Fragment key={option.value}>
                    {option.component}
                    {index < getNotificationOption().length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Profile" icon={<CgProfile />} />
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
