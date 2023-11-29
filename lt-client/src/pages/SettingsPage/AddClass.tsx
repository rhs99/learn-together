import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import AuthContext from '../../store/auth';

const AddClass = () => {
  const [newClass, setNewClass] = useState('');

  const authCtx = useContext(AuthContext);

  const handleAddClass = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/classes`;
    const payload = {
      name: newClass,
    };
    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setNewClass('');
  };

  return (
    <form onSubmit={handleAddClass}>
      <label htmlFor="add-class">Class Name</label>
      <input
        type="text"
        name="addClass"
        value={newClass}
        onChange={(event) => setNewClass(event.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddClass;
