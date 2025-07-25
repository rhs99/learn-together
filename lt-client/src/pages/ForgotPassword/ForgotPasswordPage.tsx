import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Util from '../../utils';
import useAlert from '../../hooks/use-alert';
import { NavLink } from 'react-router-dom';

import './_index.scss';

function ForgotPasswordPage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [err, setErr] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onAlert = useAlert();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const URL = Util.CONSTANTS.SERVER_URL + '/users/forgot-password';

    const userInfo = {
      userName: username,
      email: email,
    };
    axios
      .post(URL, userInfo)
      .then(() => {
        setEmailSent(true);
        onAlert('A password reset link has been sent to your email', 'success');
        setErr(false);
      })
      .catch(() => {
        setErr(true);
      });
  };

  return (
    <div className="cl-ForgotPassword">
      <div className="forgot-password-container">
        <h1 className="header">Reset Password</h1>
        <form method="POST" className="form-container" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            disabled={emailSent}
            value={username}
            onChange={handleUsernameChange}
            required
          />

          {err && <span className="err">Invalid username or email</span>}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            disabled={emailSent}
            value={email}
            onChange={handleEmailChange}
            required
          />

          <button type="submit" disabled={emailSent}>
            {emailSent ? 'Email Sent' : 'Send Reset Link'}
          </button>
        </form>
        <div className="login-link">
          Remember your password? <NavLink to="/users/login">Log In</NavLink>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
