import { useNavigate } from 'react-router-dom';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Util from '../../utils';
import './_index.scss';
import { Alert, Snackbar } from '@mui/material';

function ForgotPasswordPage() {
  const [username, setUsername] = useState<string>('');
  const [err, setErr] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate('/users/login');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setEmailSent(true);
    setShowAlert(true);
    const URL = Util.CONSTANTS.SERVER_URL + '/users/forgotPassword';

    const userInfo = {
      userName: username,
    };
    axios.post(URL, userInfo).catch(() => {
      setErr(true);
    });
  };

  return (
    <div className="cl-Forgot-Password" onSubmit={handleSubmit}>
      <div className="fp-form-container">
        <h2>Forgot Password</h2>
        <form method="POST" className="fp-form">
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
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={showAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <Alert variant="filled" onClose={handleAlertClose} severity="info">
            A Link Has been sent to your email.
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
