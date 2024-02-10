import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { User } from '../../types';

import './_index.scss';
import Table from '../../design-library/Table/Table';

const Profile = () => {
  const [user, setUser] = useState<User>();

  const { userName } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${userName}`;
    axios.get(URL).then(({ data }) => {
      setUser(data);
    });
  }, [userName]);

  if (!user) {
    return null;
  }

  const rows: any = [
    { value: ['Info', 'Value'] },
    { value: ['Username', user.userName] },
    { value: ['Class', user.class || 'N/A'] },
    { value: ['Questions', user.questions] },
    { value: ['Answers', user.answers] },
    { value: ['Up votes', user.upVote] },
    { value: ['Down Votes', user.downVote] },
  ];

  return (
    <div className="lt-Profile">
      <Table rowData={rows} />
    </div>
  );
};

export default Profile;
