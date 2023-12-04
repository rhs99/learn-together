import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Util from '../../utils';
import Alert from '../../design-library/Alert/Alert';

import './_index.scss';

function ForgotPasswordPage() {
  const [username, setUsername] = useState<string>('');
  const [err, setErr] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const URL = Util.CONSTANTS.SERVER_URL + '/users/forgot-password';

    const userInfo = {
      userName: username,
    };
    axios
      .post(URL, userInfo)
      .then(() => {
        setEmailSent(true);
        setShowAlert(true);
        setErr(false);
      })
      .catch(() => {
        setErr(true);
      });
  };

  return (
    <div className="cl-ForgotPassword" onSubmit={handleSubmit}>
      {showAlert && (
        <Alert
          type="info"
          message="A password reset link has been sent to your email"
          handleClose={() => setShowAlert(false)}
          isShown={showAlert}
        />
      )}
      <h4>Forgot Password</h4>
      <form method="POST" className="form-container">
        <label>Username:</label>
        <input
          type="text"
          name="username"
          disabled={emailSent}
          value={username}
          onChange={handleUsernameChange}
          required
        />

        {err && <span className="err">Invalid Username</span>}
        <button type="submit" disabled={emailSent}>
          Send Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
