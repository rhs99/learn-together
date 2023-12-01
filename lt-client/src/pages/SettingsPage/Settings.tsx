import axios from 'axios';
import { useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';

import { Class, Privilege } from '../../types';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import ChangeClass from './ChangeClass';
import ChangePassword from './ChangePassword';
import AddClass from './AddClass';
import AddSubject from './AddSubject';
import AddChapter from './AddChapter';
import Dropdown from '../../design-library/Dropdown/Dropdown';
import Button from '../../design-library/Button/Button';

import './_index.scss';

const Settings = () => {
  const [hasAdminPrivilege, setHasAdminPrivilege] = useState(false);
  const [currOption, setCurrOption] = useState('change-class');
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const classes = useLoaderData() as Class[];
  const authCtx = useContext(AuthContext);
  const userName = authCtx.getStoredValue().userName;

  useEffect(() => {
    if (!userName || userName.length === 0) {
      return;
    }

    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${userName}`;
    axios.get(URL).then(({ data }) => {
      data.privileges.forEach((privilege: Privilege) => {
        if (privilege.name === 'admin') {
          setHasAdminPrivilege(true);
          return;
        }
      });
    });
  }, [userName]);

  const settingsOptions = useMemo(() => {
    const options = [
      { label: 'Change class', value: 'change-class' },
      { label: 'Change password', value: 'change-password' },
    ];
    if (hasAdminPrivilege) {
      options.push(
        { label: 'Add class', value: 'add-class' },
        { label: 'Add subject', value: 'add-subject' },
        { label: 'Add chapter', value: 'add-chapter' }
      );
    }

    return options;
  }, [hasAdminPrivilege]);

  const handleSettingsOptionSelect = useCallback((value: string) => {
    setCurrOption(value);
  }, []);

  const getComponent = () => {
    if (currOption === 'change-class') {
      return <ChangeClass classes={classes} />;
    } else if (currOption === 'change-password') {
      return <ChangePassword />;
    } else if (currOption === 'add-class') {
      return <AddClass />;
    } else if (currOption === 'add-subject') {
      return <AddSubject classes={classes} />;
    } else if (currOption === 'add-chapter') {
      return <AddChapter classes={classes} />;
    } else {
      return <p>Nothing!</p>;
    }
  };

  return (
    <div className="lt-settings">
      <div className="header">
        <h3>{settingsOptions.find((option) => option.value === currOption)?.label}</h3>
        <div ref={settingsRef} className="menu">
          <Button onClick={() => setShowSettingsDropdown((prev) => !prev)}>Settings</Button>
        </div>
      </div>
      <Dropdown
        options={settingsOptions}
        anchorElement={settingsRef?.current}
        isShown={showSettingsDropdown}
        onClose={() => setShowSettingsDropdown(false)}
        onSelect={handleSettingsOptionSelect}
      />
      {getComponent()}
    </div>
  );
};

export default Settings;
