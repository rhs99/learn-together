import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import AuthContext from '../../store/auth';
import Util from '../../utils';
import Icon from '../../design-library/Icon';
import Dropdown from '../../design-library/Dropdown/Dropdown';

import './_index.scss';

const Navigation = () => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const [notifications, setNotifications] = useState<string[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const accountAnchorEl = useRef<HTMLDivElement | null>(null);
  const notificationAnchorEl = useRef<HTMLDivElement | null>(null);

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
    setShowNotificationDropdown((prev) => !prev);
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

  const handleOptionSelect = (value: string) => {
    if (value === 'profile') {
      goToProfile();
    } else if (value === 'settings') {
      goToSettings();
    } else if (value === 'logout') {
      logoutHandler();
    }
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
        <div className="gap">
          <NavLink
            to="/donate"
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : 'idle')}
          >
            Donate
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
            <div ref={notificationAnchorEl}>
              <Icon
                onClick={handleNotificationFetch}
                name="notification"
                size={22}
                color={hasNewNotification ? 'red' : 'black'}
              />
            </div>
            <Dropdown
              options={getNotificationOption()}
              onSelect={handleGoToNotification}
              isShown={showNotificationDropdown}
              onClose={() => setShowNotificationDropdown(false)}
              anchorElement={notificationAnchorEl?.current}
              className="notification-dropdown"
            />
            <div ref={accountAnchorEl}>
              <Icon name="account" onClick={() => setShowAccountDropdown((prev) => !prev)} size={22} />
            </div>
            <Dropdown
              options={[
                { value: 'profile', label: 'Profile', component: <Icon name="profile" /> },
                { value: 'settings', label: 'Settings', component: <Icon name="settings" /> },
                { value: 'logout', label: 'Logout', component: <Icon name="logout" /> },
              ]}
              onSelect={handleOptionSelect}
              anchorElement={accountAnchorEl?.current}
              isShown={showAccountDropdown}
              onClose={() => setShowAccountDropdown(false)}
              className="account-dropdown"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Navigation;
