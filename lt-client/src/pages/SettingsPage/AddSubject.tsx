import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { Class, HttpError } from '../../types';
import AuthContext from '../../store/auth';
import { Box, Heading, Field, Input, Button, Select, SelectContent, SelectTrigger } from '@optiaxiom/react';

type AddSubjectProps = {
  classes: Class[];
};

const AddSubject = ({ classes }: AddSubjectProps) => {
  const [classForSubject, setClassForSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [err, setErr] = useState('');

  const authCtx = useContext(AuthContext);

  const handleAddSubject = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/subjects`;
    const payload = {
      name: newSubject,
      class: classForSubject,
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      });
      setNewSubject('');
      setClassForSubject('');
      setErr('');
    } catch (error: unknown) {
      const httpError = error as HttpError;
      setErr(httpError.response?.data?.message || 'Failed to add subject');
    }
  };

  return (
    <Box className="settings-form-container">
      <Heading level="2" fontSize="xl" mb="24">
        Add Subject
      </Heading>
      <Box asChild>
        <form onSubmit={handleAddSubject}>
          <Field label="Class Name" required>
            <Select
              value={classForSubject}
              onValueChange={setClassForSubject}
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

          <Field label="Subject Name" required error={err || undefined}>
            <Input value={newSubject} onValueChange={setNewSubject} required />
          </Field>

          <Button type="submit" w="full" justifyContent="center">
            Add
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddSubject;
