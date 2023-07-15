import { useLoaderData } from 'react-router-dom';
import { Class } from '../../types';
import { FormEvent, useContext, useState } from 'react';

import './_index.scss';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import axios from 'axios';

const Settings = () => {
  const classes = useLoaderData();
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [_class, setClass] = useState('');

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
      .catch((e) => {
        console.log(e);
      });
    setClass('');
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Password don't match");
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
      .catch((e) => {
        console.log(e);
      });
    setPrevPassword('');
    setPassword('');
    setConfirmPassword('');
  };
  //console.log(_class);
  return (
    <div className="lt-settings">
      <div className="change-class">
        <h2>Change class</h2>
        <form onSubmit={handleChangeClass}>
          <select value={_class} onChange={(event) => setClass(event.target.value)} name="class">
            <option value="">Select class</option>
            {(classes as Class[]).map((_class) => (
              <option value={_class._id} key={_class._id}>
                {_class.name}
              </option>
            ))}
          </select>
          <button type="submit">Change</button>
        </form>

        <h2>Create an Account</h2>
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
    </div>
  );
};

export default Settings;
