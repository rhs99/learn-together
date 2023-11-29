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

  const authCtx = useContext(AuthContext);

  const handleChangeClass = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/users/update-class`;
    const payload = {
      userName: authCtx.getStoredValue().userName,
      _class: _class,
    };

    await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setClass('');
  };

  return (
    <form onSubmit={handleChangeClass}>
      <select value={_class} onChange={(event) => setClass(event.target.value)} name="class" required>
        <option value="">Select class</option>
        {(classes as Class[]).map((_class) => (
          <option value={_class._id} key={_class._id}>
            {_class.name}
          </option>
        ))}
      </select>
      <button type="submit">Change</button>
    </form>
  );
};

export default ChangeClass;
