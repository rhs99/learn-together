import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { Class, Privilege } from '../../types';
import { FormEvent, useContext, useEffect, useState } from 'react';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import { Alert } from '@mui/material';

import './_index.scss';
import { eventNames } from 'process';

const Settings = () => {
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [_class, setClass] = useState('');
  const [newClass, setNewClass] = useState('');
  const [classForSubject, setClassForSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [hasAdminPrivilege, setHasAdminPrivilege] = useState(false);
  const [alert, setAlert] = useState<{ showAlert: boolean; type: string; msg: string }>({
    showAlert: false,
    type: '',
    msg: '',
  });

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/users?userName=${authCtx.getStoredValue().userName}`;
    axios.get(URL).then(({ data }) => {
      data.privileges.forEach((privilege: Privilege) => {
        if (privilege.name === 'admin') {
          setHasAdminPrivilege(true);
          return;
        }
      });
    });
  }, []);
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

  const handleAddClass = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/classes/create`;
    const payload = {
      name: newClass,
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
          msg: 'Class created successfully!',
        });
      })
      .catch((e) => {
        console.log(e);
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Class create failed!',
        });
      });
    setNewClass('');
  };

  const handleAddSubject = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/subjects/create`;
    const payload = {
      name: newSubject,
      class: classForSubject,
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
          msg: 'Subject created successfully!',
        });
      })
      .catch((e) => {
        console.log(e);
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Subject create failed!',
        });
      });
    setClassForSubject('');
  };

  return (
    <div className="lt-settings">
      {alert.showAlert && (
        <Alert
          sx={{ marginTop: '10px', width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
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
      {!hasAdminPrivilege && (
        <>
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
        </>
      )}
      {hasAdminPrivilege && (
        <>
          <h2>Add New Class</h2>
          <form onSubmit={handleAddClass}>
            <label htmlFor="add-class">Class No.</label>
            <input
              type="number"
              name="addClass"
              value={newClass}
              onChange={(event) => setNewClass(event.target.value)}
              required
            />
            <button type="submit">Add</button>
          </form>

          <h2>Add New Subject</h2>
          <form onSubmit={handleAddSubject}>
            <label htmlFor="check-class">Class No.</label>
            <select
              value={classForSubject}
              onChange={(event) => setClassForSubject(event.target.value)}
              name="class"
              required
            >
              <option value="">Select class</option>
              {(classes as Class[]).map((_class) => (
                <option value={_class._id} key={_class._id}>
                  {_class.name}
                </option>
              ))}
            </select>
            <label htmlFor="add-subject">Subject Name</label>
            <input
              type="text"
              name="addSubject"
              value={newSubject}
              onChange={(event) => setNewSubject(event.target.value)}
              required
            />
            <button type="submit">Add</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Settings;
