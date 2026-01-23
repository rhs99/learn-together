import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { Class, Subject, HttpError } from '../../types';
import AuthContext from '../../store/auth';
import { Box, Heading, Field, Input, Button, Select, SelectContent, SelectTrigger } from '@optiaxiom/react';

type AddChapterProps = {
  classes: Class[];
};

const AddChapter = ({ classes }: AddChapterProps) => {
  const [classForSubject, setClassForSubject] = useState('');
  const [subjectForChapter, setSubjectForChapter] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [err, setErr] = useState('');

  const authCtx = useContext(AuthContext);

  const fetchSubjects = async (classId: string) => {
    try {
      const URL = `${Util.CONSTANTS.SERVER_URL}/subjects?classId=${classId}`;
      const { data } = await axios.get(URL);
      setSubjects(data);
      setErr('');
    } catch (error: unknown) {
      const httpError = error as HttpError;
      setErr(httpError.response?.data?.message || 'Failed to fetch subjects');
    }
  };

  const handleAddChapter = async (event: FormEvent) => {
    event.preventDefault();

    const url = `${Util.CONSTANTS.SERVER_URL}/chapters`;
    const payload = {
      name: newChapter,
      subject: subjectForChapter,
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      });
      setNewChapter('');
      setSubjectForChapter('');
      setErr('');
    } catch (error: unknown) {
      const httpError = error as HttpError;
      setErr(httpError.response?.data?.message || 'Failed to add chapter');
    }
  };

  const handleClassChange = async (value: string) => {
    setClassForSubject(value);
    await fetchSubjects(value);
  };

  return (
    <Box className="settings-form-container">
      <Heading level="2" fontSize="xl" mb="24">
        Add Chapter
      </Heading>
      <Box asChild>
        <form onSubmit={handleAddChapter}>
          <Field label="Class Name" required>
            <Select
              value={classForSubject}
              onValueChange={handleClassChange}
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

          <Field label="Select subject" required>
            <Select
              value={subjectForChapter}
              onValueChange={setSubjectForChapter}
              options={[
                { label: 'Select subject', value: '' },
                ...subjects.map((subject) => ({
                  label: subject.name,
                  value: subject._id,
                })),
              ]}
            >
              <SelectTrigger placeholder="Select subject" />
              <SelectContent />
            </Select>
          </Field>

          <Field label="Chapter Name" required error={err || undefined}>
            <Input value={newChapter} onValueChange={setNewChapter} required />
          </Field>

          <Button type="submit" w="full" justifyContent="center">
            Add
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddChapter;
