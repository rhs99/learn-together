import axios from 'axios';
import { FormEvent, useState, useContext } from 'react';
import { Class } from '../../types';
import Util from '../../utils';
import AuthContext from '../../store/auth';

type ChangeClassProps = {
  classes: Class[];
};

const ChangeClass = ({ classes }: ChangeClassProps) => {
  const [_class, setClass] = useState('');
  const [err, setErr] = useState('');

  const authCtx = useContext(AuthContext);

  const handleChangeClass = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/users/update-class`;
    const payload = {
      userName: authCtx.getStoredValue().userName,
      _class: _class,
    };

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      });
      setClass('');
      setErr('');
    } catch (error: any) {
      setErr(error.response?.data?.message || 'Failed to update class');
    }
  };

  return (
    <div className="settings-form-container">
      <h2 className="header">Change Class</h2>
      <form onSubmit={handleChangeClass}>
        <label htmlFor="class">Class</label>
        <select value={_class} onChange={(event) => setClass(event.target.value)} name="class" required>
          <option value="">Select class</option>
          {(classes as Class[]).map((_class) => (
            <option value={_class._id} key={_class._id}>
              {_class.name}
            </option>
          ))}
        </select>
        {err && <span className="err">{err}</span>}
        <button type="submit" className="settings-button">
          Change
        </button>
      </form>
    </div>
  );
};

export default ChangeClass;
