import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import AuthContext from '../../store/auth';

const ChangePassword = () => {
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const authCtx = useContext(AuthContext);

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      return;
    }

    const url = `${Util.CONSTANTS.SERVER_URL}/users/update-password`;
    const payload = {
      userName: authCtx.getStoredValue().userName,
      prevPassword: prevPassword,
      password: password,
    };

    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setPrevPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <form onSubmit={handleChangePassword}>
      <label htmlFor="password">Previous Password</label>
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
      <label htmlFor="confirm-password">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
      />
      <button type="submit">Change</button>
    </form>
  );
};

export default ChangePassword;
