import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { HttpError } from '../../types';
import AuthContext from '../../store/auth';
import { Box, Heading, Field, Input, Button } from '@optiaxiom/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const ChangePassword = () => {
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');
  const [showPrevPassword, setShowPrevPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <Input
              type={showPrevPassword ? 'text' : 'password'}
              value={prevPassword}
              onValueChange={setPrevPassword}
              required
              addonAfter={
                <Button
                  type="button"
                  appearance="subtle"
                  icon={showPrevPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  onClick={() => setShowPrevPassword(!showPrevPassword)}
                  rounded="full"
                  size="sm"
                />
              }
            />
          </Field>

          <Field label="New Password" required>
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

          <Field label="Confirm New Password" required error={err || undefined}>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onValueChange={setConfirmPassword}
              required
              addonAfter={
                <Button
                  type="button"
                  appearance="subtle"
                  icon={showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  rounded="full"
                  size="sm"
                />
              }
            />
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
