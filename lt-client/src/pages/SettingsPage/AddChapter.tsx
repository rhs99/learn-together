import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { Class, Subject } from '../../types';
import AuthContext from '../../store/auth';

type AddChapterProps = {
  classes: Class[];
};

const AddChapter = ({ classes }: AddChapterProps) => {
  const [classForSubject, setClassForSubject] = useState('');
  const [subjectForChapter, setSubjectForChapter] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const authCtx = useContext(AuthContext);

  const fetchSubjects = async (classId: string) => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/subjects?classId=${classId}`;
    axios.get(URL).then(({ data }) => {
      setSubjects(data);
    });
  };

  const handleAddChapter = async (event: FormEvent) => {
    event.preventDefault();

    const url = `${Util.CONSTANTS.SERVER_URL}/chapters`;
    const payload = {
      name: newChapter,
      subject: subjectForChapter,
    };
    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setNewChapter('');
    setSubjectForChapter('');
  };

  return (
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
      <button type="submit">Add</button>
    </form>
  );
};

export default AddChapter;
