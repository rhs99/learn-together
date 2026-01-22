import { useState, FormEvent } from 'react';
import axios from 'axios';
import Util from '../../utils';
import useAlert from '../../hooks/use-alert';
import { NavLink } from 'react-router-dom';
import { Box, Heading, Field, Input, Button, Text } from '@optiaxiom/react';

import './_index.scss';

function ForgotPasswordPage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [err, setErr] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onAlert = useAlert();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const URL = Util.CONSTANTS.SERVER_URL + '/users/forgot-password';

    const userInfo = {
      userName: username,
      email: email,
    };
    axios
      .post(URL, userInfo)
      .then(() => {
        setEmailSent(true);
        onAlert('A password reset link has been sent to your email', 'success');
        setErr(false);
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
          Reset Password
        </Heading>
        <Box asChild>
          <form onSubmit={handleSubmit}>
            <Field label="Username" required error={err ? 'Invalid username or email' : undefined}>
              <Input value={username} onValueChange={setUsername} disabled={emailSent} required />
            </Field>

            <Field label="Email" required>
              <Input type="email" value={email} onValueChange={setEmail} disabled={emailSent} required />
            </Field>

            <Button type="submit" w="full" justifyContent="center" disabled={emailSent}>
              {emailSent ? 'Email Sent' : 'Send Reset Link'}
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
}

export default ForgotPasswordPage;
