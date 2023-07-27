import { useNavigate, useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import axios from 'axios';

import Util from '../../utils';

import './_index.scss';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');
  const { userId } = useParams();

  const navigate = useNavigate();

  const handleReset = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErr('Confirm Password should match Password');
      return;
    }

    const URL = Util.CONSTANTS.SERVER_URL + '/users/reset-password';

    const userInfo = {
      userId: userId,
      password: password,
    };

    axios
      .post(URL, userInfo)
      .then(() => {
        navigate('/users/login');
      })
      .catch((err) => {
        setErr(err.response.data.message);
      });
  };

  return (
    <div className="cl-Reset-Password">
      <div className="rp-form-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <label htmlFor="password">Password</label>
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
          {err && <span className="err">{err}</span>}
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
