import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { Class } from '../../types';
import { FormEvent, useContext, useState } from 'react';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import { Alert } from '@mui/material';

import './_index.scss';

const Settings = () => {
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [_class, setClass] = useState('');
  const [alert, setAlert] = useState<{ showAlert: boolean; type: string; msg: string }>({
    showAlert: false,
    type: '',
    msg: '',
  });

  const classes = useLoaderData();
  const authCtx = useContext(AuthContext);

  const handleChangeClass = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/users/updateClass`;
    const payload = {
      userName: authCtx.getStoredValue().userName,
      _class: _class,
    };

    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Class updated successfully!',
        });
      })
      .catch((e) => {
        console.log(e);
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Class update failed!',
        });
      });
    setClass('');
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setAlert({
        showAlert: true,
        type: 'info',
        msg: 'New Password and Confirm Password must match!',
      });
      return;
    }

    const url = `${Util.CONSTANTS.SERVER_URL}/users/updatePassword`;
    const payload = {
      userName: authCtx.getStoredValue().userName,
      prevPassword: prevPassword,
      password: password,
    };

    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Password changed successfully!',
        });
      })
      .catch((e) => {
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Password update failed!',
        });
      });
    setPrevPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="lt-settings">
      {alert.showAlert && (
        <Alert
          sx={{ marginTop: '10px', width: '60%', marginLeft: 'auto' }}
          severity={alert.type === 'error' ? 'error' : alert.type === 'success' ? 'success' : 'info'}
          onClose={() => {
            setAlert({
              showAlert: false,
              type: '',
              msg: '',
            });
          }}
        >
          {alert.msg}
        </Alert>
      )}
      <h2>Change Class</h2>
      <form onSubmit={handleChangeClass}>
        <select value={_class} onChange={(event) => setClass(event.target.value)} name="class" required>
          <option value="">Select class</option>
          {(classes as Class[]).map((_class) => (
            <option value={_class._id} key={_class._id}>
              {_class.name}
            </option>
          ))}
        </select>
        <button type="submit">Change</button>
      </form>

      <h2>Change Password</h2>
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
    </div>
  );
};

export default Settings;
