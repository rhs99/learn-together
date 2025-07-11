import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { Class, Subject, HttpError } from '../../types';
import AuthContext from '../../store/auth';

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

  return (
    <div className="settings-form-container">
      <h2 className="header">Add Chapter</h2>
      <form onSubmit={handleAddChapter}>
        <label htmlFor="check-class">Class Name</label>
        <select
          value={classForSubject}
          onChange={async (event) => {
            setClassForSubject(event.target.value);
            await fetchSubjects(event.target.value);
          }}
          name="class"
          required
        >
          <option value="">Select class</option>
          {(classes as Class[]).map((_class) => (
            <option value={_class._id} key={_class._id}>
              {_class.name}
            </option>
          ))}
        </select>
        <label htmlFor="check-subject">Select subject</label>
        <select
          value={subjectForChapter}
          onChange={(event) => setSubjectForChapter(event.target.value)}
          name="subject"
          required
        >
          <option value="">Select subject</option>
          {subjects.map((subject) => (
            <option value={subject._id} key={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
        <label htmlFor="add-chapter">Chapter Name</label>
        <input
          type="text"
          name="addChapter"
          value={newChapter}
          onChange={(event) => setNewChapter(event.target.value)}
          required
        />
        {err && <span className="err">{err}</span>}
        <button type="submit" className="settings-button">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddChapter;
