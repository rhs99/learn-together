import { useNavigate } from 'react-router-dom';
import { useState, ChangeEvent, useContext, FormEvent } from 'react';
import axios from 'axios';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import './_index.scss';

function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const URL = Util.CONSTANTS.SERVER_URL + '/users/login';

    const userInfo = {
      userName: username,
      password: password,
    };
    axios
      .post(URL, userInfo)
      .then(({ data }) => {
        authCtx.login(data.token, username);
        navigate(`/classes/${data.class}`);
      })
      .catch(() => {
        setErr(true);
      });
  };

  return (
    <div className="cl-Login" onSubmit={handleSubmit}>
      <div className="login-form-container">
        <h2>Login</h2>
        <form method="POST" className="login-form">
          <label>
            Username:
            <input type="text" name="username" value={username} onChange={handleUsernameChange} required />
          </label>
          <label>
            Password:
            <input type="password" name="password" value={password} onChange={handlePasswordChange} required />
          </label>
          {err && <span className="err">Invalid Credentials</span>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
