import { useNavigate } from 'react-router-dom';
import { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import { NavLink } from 'react-router-dom';
import { Box, Heading, Field, Input, Button, Text, Link } from '@optiaxiom/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

import './_index.scss';

function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [err, setErr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleForgotPassword = () => {
    navigate('/users/forgot-password');
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
        if (data.class) {
          navigate(`/classes/${data.class}`);
        } else {
          navigate('/');
        }
      })
      .catch(() => {
        setErr(true);
      });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt="40">
      <Box
        data-form-container
        w="1/4"
        p="32"
        bg="bg.default"
        rounded="lg"
        shadow="lg"
        border="1"
        borderColor="border.default"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <Box
          style={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--gradient-primary)',
          }}
        />
        <Heading level="1" fontSize="2xl" textAlign="center" mb="24">
          Login
        </Heading>
        <Box asChild>
          <form onSubmit={handleSubmit}>
            <Field label="Username" required>
              <Input value={username} onValueChange={setUsername} required />
            </Field>

            <Field label="Password" required error={err ? 'Invalid Credentials' : undefined}>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onValueChange={setPassword}
                required
                addonAfter={
                  <Button
                    type="button"
                    appearance="subtle"
                    icon={showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    onClick={() => setShowPassword(!showPassword)}
                    rounded="full"
                    size="sm"
                  />
                }
              />
            </Field>

            {err && (
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
                fontSize="sm"
              >
                Forgot password?
              </Link>
            )}

            <Button type="submit" w="full" justifyContent="center">
              Login
            </Button>
          </form>
        </Box>
        <Box textAlign="center" mt="16">
          <Text fontSize="sm" color="fg.secondary">
            Don't have an account?{' '}
            <NavLink to="/users/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Sign Up
            </NavLink>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
