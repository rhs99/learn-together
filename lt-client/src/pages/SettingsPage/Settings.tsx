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

import {
  Box,
  Text,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Flex,
} from '@optiaxiom/react';

import './_index.scss';
import AddPaymentMethod from './AddPaymentMethod';

const Settings = () => {
  const [hasAdminPrivilege, setHasAdminPrivilege] = useState(false);
  const [currOption, setCurrOption] = useState('change-class');

  const classes = useLoaderData() as Class[];
  const authCtx = useContext(AuthContext);
  const userName = authCtx.getStoredValue().userName;

  useEffect(() => {
    if (!userName || userName.length === 0) {
      return;
    }

    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${userName}`;
    axios.get(URL).then(({ data }) => {
      data.privileges?.forEach((privilege: Privilege) => {
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
        { label: 'Add chapter', value: 'add-chapter' },
        { label: 'Add Payment Method', value: 'add-payment-method' }
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
    } else if (currOption === 'add-payment-method') {
      return <AddPaymentMethod />;
    } else {
      return <p>Nothing!</p>;
    }
  };

  return (
    <Flex flexDirection="column" gap="12" className="lt-settings">
      <Flex flexDirection="row" justifyContent="space-between">
        <Text>{settingsOptions.find((option) => option.value === currOption)?.label}</Text>

        <DropdownMenu>
          <DropdownMenuTrigger>Settings</DropdownMenuTrigger>
          <DropdownMenuContent>
            {settingsOptions.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => handleSettingsOptionSelect(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      {getComponent()}
    </Flex>
  );
};

export default Settings;
