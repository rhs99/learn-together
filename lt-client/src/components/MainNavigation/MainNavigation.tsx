import { NavLink } from 'react-router-dom';

import './_index.scss';

const MainNavigation = () => {
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
        <li>
          <NavLink to="/users/login">Login</NavLink>
        </li>
        <li className="item">
          <NavLink to="/users/signup">Signup</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavigation;
