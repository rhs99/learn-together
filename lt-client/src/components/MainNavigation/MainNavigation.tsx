import { NavLink, redirect } from 'react-router-dom';
import { useContext } from 'react';
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
    <nav className="cl-mainNavigation">
      <ul className="container">
        <li>
          <NavLink
            to="/"
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
          >
            About
          </NavLink>
        </li>
        {!isLoggedIn && (
          <li>
            <NavLink to="/users/login">Login</NavLink>
          </li>
        )}
        {!isLoggedIn && (
          <li className="item">
            <NavLink to="/users/signup">Signup</NavLink>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button onClick={logoutHandler}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MainNavigation;
