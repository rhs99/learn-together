import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Util from '../../utils';
import useAlert from '../../hooks/use-alert';

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
    <div className="cl-ForgotPassword" onSubmit={handleSubmit}>
      <h3>Forgot Password</h3>
      <form method="POST" className="form-container">
        <label>
          Username:
          <input
            type="text"
            name="username"
            disabled={emailSent}
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </label>

        {err && <span className="err">Invalid Username</span>}
        <label>
          Email:
          <input type="text" name="email" disabled={emailSent} value={email} onChange={handleEmailChange} required />
        </label>
        <button type="submit" disabled={emailSent}>
          Send Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
