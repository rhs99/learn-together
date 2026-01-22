import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { HttpError } from '../../types';
import AuthContext from '../../store/auth';
import { Box, Heading, Field, Input, Button } from '@optiaxiom/react';

const ChangePassword = () => {
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');

  const authCtx = useContext(AuthContext);

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErr('Confirm Password should match New Password');
      return;
    }

    const userName = authCtx.getStoredValue().userName;
    const url = `${Util.CONSTANTS.SERVER_URL}/users/${userName}`;
    const payload = {
      prevPassword: prevPassword,
      password: password,
    };

    try {
      await axios.patch(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      });
      setPrevPassword('');
      setPassword('');
      setConfirmPassword('');
      setErr('');
    } catch (error: unknown) {
      const httpError = error as HttpError;
      setErr(httpError.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <Box className="settings-form-container">
      <Heading level="2" fontSize="xl" mb="24">
        Change Password
      </Heading>
      <Box asChild>
        <form onSubmit={handleChangePassword}>
          <Field label="Previous Password" required>
            <Input type="password" value={prevPassword} onValueChange={setPrevPassword} required />
          </Field>

          <Field label="New Password" required>
            <Input type="password" value={password} onValueChange={setPassword} required />
          </Field>

          <Field label="Confirm New Password" required error={err || undefined}>
            <Input type="password" value={confirmPassword} onValueChange={setConfirmPassword} required />
          </Field>

          <Button type="submit" w="full" justifyContent="center">
            Update Password
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ChangePassword;
