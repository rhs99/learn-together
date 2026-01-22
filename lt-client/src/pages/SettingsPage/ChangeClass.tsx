import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import { Class, HttpError } from '../../types';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import { Box, Heading, Field, Button, Select, SelectContent, SelectTrigger } from '@optiaxiom/react';

type ChangeClassProps = {
  classes: Class[];
};

const ChangeClass = ({ classes }: ChangeClassProps) => {
  const [_class, setClass] = useState('');
  const [err, setErr] = useState('');

  const authCtx = useContext(AuthContext);

  const handleChangeClass = async (event: FormEvent) => {
    event.preventDefault();
    const userName = authCtx.getStoredValue().userName;
    const url = `${Util.CONSTANTS.SERVER_URL}/users/${userName}`;
    const payload = {
      _class: _class,
    };

    try {
      await axios.patch(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      });
      setClass('');
      setErr('');
    } catch (error: unknown) {
      const httpError = error as HttpError;
      setErr(httpError.response?.data?.message || 'Failed to update class');
    }
  };

  return (
    <Box className="settings-form-container">
      <Heading level="2" fontSize="xl" mb="24">
        Change Class
      </Heading>
      <Box asChild>
        <form onSubmit={handleChangeClass}>
          <Field label="Class" required error={err || undefined}>
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
            Change
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ChangeClass;
