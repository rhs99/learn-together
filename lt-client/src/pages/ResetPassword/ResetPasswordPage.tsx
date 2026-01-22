import { useNavigate, useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Box, Heading, Field, Input, Button, Text } from '@optiaxiom/react';

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
          Reset Password
        </Heading>
        <Box asChild>
          <form onSubmit={handleReset}>
            <Field label="Password" required>
              <Input type="password" value={password} onValueChange={setPassword} required />
            </Field>

            <Field label="Confirm Password" required error={err || undefined}>
              <Input type="password" value={confirmPassword} onValueChange={setConfirmPassword} required />
            </Field>

            <Button type="submit" w="full" justifyContent="center">
              Reset Password
            </Button>
          </form>
        </Box>
        <Box textAlign="center" mt="16">
          <Text fontSize="sm" color="fg.secondary">
            Remember your password?{' '}
            <NavLink to="/users/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Log In
            </NavLink>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
