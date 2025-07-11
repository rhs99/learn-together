import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { HttpError } from '../../types';
import AuthContext from '../../store/auth';

const ChangePassword = () => {
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');

  const authCtx = useContext(AuthContext);

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErr('Confirm Password should match New Password');
      return;
    }

    const url = `${Util.CONSTANTS.SERVER_URL}/users/update-password`;
    const payload = {
      userName: authCtx.getStoredValue().userName,
      prevPassword: prevPassword,
      password: password,
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      });
      setPrevPassword('');
      setPassword('');
      setConfirmPassword('');
      setErr('');
    } catch (error: unknown) {
      const httpError = error as HttpError;
      setErr(httpError.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="settings-form-container">
      <h2 className="header">Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <label htmlFor="prevPassword">Previous Password</label>
        <input
          type="password"
          name="prevPassword"
          value={prevPassword}
          onChange={(event) => setPrevPassword(event.target.value)}
          required
        />
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
        {err && <span className="err">{err}</span>}
        <button type="submit" className="settings-button">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
