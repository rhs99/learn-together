import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { Class } from '../../types';
import AuthContext from '../../store/auth';

type AddSubjectProps = {
  classes: Class[];
};

const AddSubject = ({ classes }: AddSubjectProps) => {
  const [classForSubject, setClassForSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const authCtx = useContext(AuthContext);

  const handleAddSubject = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/subjects`;
    const payload = {
      name: newSubject,
      class: classForSubject,
    };
    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setNewSubject('');
    setClassForSubject('');
  };

  return (
    <form onSubmit={handleAddSubject}>
      <label htmlFor="check-class">Class Name</label>
      <select
        value={classForSubject}
        onChange={(event) => setClassForSubject(event.target.value)}
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
      <label htmlFor="add-subject">Subject Name</label>
      <input
        type="text"
        name="addSubject"
        value={newSubject}
        onChange={(event) => setNewSubject(event.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddSubject;
