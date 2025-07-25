import { useLoaderData, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { Class } from '../../types';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import Util from '../../utils';

import './_index.scss';

export async function loader() {
  const URL = Util.CONSTANTS.SERVER_URL + '/classes';
  const { data } = await axios.get(URL);
  return data;
}

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [_class, setClass] = useState('');
  const [err, setErr] = useState('');

  const classes = useLoaderData();
  const navigate = useNavigate();

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErr('Confirm Password should match Password');
      return;
    }

    const URL = Util.CONSTANTS.SERVER_URL + '/users';

    const userInfo: { [key: string]: string } = {
      userName: username,
      email: email,
      password: password,
    };

    if (_class.trim().length > 0) {
      userInfo.class = _class;
    }

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
    <div className="cl-Signup">
      <div className="signup-form-container">
        <h1 className="header">Create an Account</h1>
        <form onSubmit={handleSignup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <label htmlFor="email">E-mail</label>
          <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
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
          <label htmlFor="class">Class</label>
          <select value={_class} onChange={(event) => setClass(event.target.value)} name="class">
            <option value="">Select class</option>
            {(classes as Class[]).map((_class) => (
              <option value={_class._id} key={_class._id}>
                {_class.name}
              </option>
            ))}
          </select>
          <button type="submit">Sign Up</button>
        </form>
        <div className="login-link">
          Already have an account? <NavLink to="/users/login">Log In</NavLink>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
