import { useLoaderData, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { Class } from '../../types';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Box, Heading, Field, Input, Button, Text, Select, SelectContent, SelectTrigger } from '@optiaxiom/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          Create an Account
        </Heading>
        <Box asChild>
          <form onSubmit={handleSignup}>
            <Field label="Username" required>
              <Input value={username} onValueChange={setUsername} required />
            </Field>

            <Field label="E-mail" required>
              <Input type="email" value={email} onValueChange={setEmail} required />
            </Field>

            <Field label="Password" required description="Must be at least 6 characters long">
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

            <Field label="Confirm Password" required error={err || undefined}>
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

            <Field label="Class">
              <Select
                value={_class}
                onValueChange={setClass}
                options={[
                  { label: 'Select class', value: '' },
                  ...(classes as Class[]).map((_class) => ({
                    label: _class.name,
                    value: _class._id,
                  })),
                ]}
              >
                <SelectTrigger placeholder="Select class" />
                <SelectContent />
              </Select>
            </Field>

            <Button type="submit" w="full" justifyContent="center">
              Sign Up
            </Button>
          </form>
        </Box>
        <Box textAlign="center" mt="16">
          <Text fontSize="sm" color="fg.secondary">
            Already have an account?{' '}
            <NavLink to="/users/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Log In
            </NavLink>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupPage;
