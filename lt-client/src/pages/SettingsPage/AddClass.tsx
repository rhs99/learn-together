import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { HttpError } from '../../types';
import AuthContext from '../../store/auth';
import { Box, Heading, Field, Input, Button } from '@optiaxiom/react';

const AddClass = () => {
  const [newClass, setNewClass] = useState('');
  const [err, setErr] = useState('');

  const authCtx = useContext(AuthContext);

  const handleAddClass = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/classes`;
    const payload = {
      name: newClass,
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      });
      setNewClass('');
      setErr('');
    } catch (error: unknown) {
      const httpError = error as HttpError;
      setErr(httpError.response?.data?.message || 'Failed to add class');
    }
  };

  return (
    <Box className="settings-form-container">
      <Heading level="2" fontSize="xl" mb="24">
        Add Class
      </Heading>
      <Box asChild>
        <form onSubmit={handleAddClass}>
          <Field label="Class Name" required error={err || undefined}>
            <Input value={newClass} onValueChange={setNewClass} required />
          </Field>

          <Button type="submit" w="full" justifyContent="center">
            Add
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddClass;
