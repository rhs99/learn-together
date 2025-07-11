import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import Util from '../../utils';
import { HttpError } from '../../types';
import AuthContext from '../../store/auth';

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
    <div className="settings-form-container">
      <h2 className="header">Add Class</h2>
      <form onSubmit={handleAddClass}>
        <label htmlFor="add-class">Class Name</label>
        <input
          type="text"
          name="addClass"
          value={newClass}
          onChange={(event) => setNewClass(event.target.value)}
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

export default AddClass;
