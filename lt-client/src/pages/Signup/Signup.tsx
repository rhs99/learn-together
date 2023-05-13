import { Form, redirect, useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import Util from '../../utils';

import './_index.scss';

type Class = {
  name: string;
  _id: string;
};

export async function loader() {
  const URL = Util.CONSTANTS.SERVER_URL + '/classes/list';
  const { data } = await axios.get(URL);
  return data;
}

export async function action({ request }: { request: Request }) {
  const URL = Util.CONSTANTS.SERVER_URL + '/users/create';
  const formData = await request.formData();
  const userInput = Object.fromEntries(formData);

  const userInfo = {
    userName: userInput.username,
    password: userInput.password,
    class: userInput.class,
  };

  await axios.post(URL, userInfo);

  return redirect('/users/login');
}

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [_class, setClass] = useState('');

  const classes = useLoaderData();

  return (
    <div className="cl-Signup">
      <div className="signup-form-container">
        <h2>Create an Account</h2>
        <Form method="post">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
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
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
