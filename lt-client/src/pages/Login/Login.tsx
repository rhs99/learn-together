import { useNavigate } from 'react-router-dom';
import { useState, ChangeEvent, useContext, FormEvent } from 'react';
import axios from 'axios';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import { NavLink } from 'react-router-dom';

import './_index.scss';

function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleForgotPassword = () => {
    navigate('/users/forgot-password');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const URL = Util.CONSTANTS.SERVER_URL + '/users/login';

    const userInfo = {
      userName: username,
      password: password,
    };
    axios
      .post(URL, userInfo)
      .then(({ data }) => {
        authCtx.login(data.token, username);
        if (data.class) {
          navigate(`/classes/${data.class}`);
        } else {
          navigate('/');
        }
      })
      .catch(() => {
        setErr(true);
      });
  };

  return (
    <div className="cl-Login" onSubmit={handleSubmit}>
      <div className="login-form-container">
        <h1 className="header">Login</h1>
        <form method="POST" className="login-form">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" value={username} onChange={handleUsernameChange} required />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {err && (
            <>
              <p className="err">Invalid Credentials</p>
              <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                Forgot password?
              </a>
            </>
          )}
          <button type="submit">Login</button>
        </form>
        <div className="signup-link">
          Don't have an account? <NavLink to="/users/signup">Sign Up</NavLink>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
