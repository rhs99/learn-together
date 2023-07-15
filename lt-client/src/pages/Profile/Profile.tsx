import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { User } from '../../types';

import './_index.scss';

const Profile = () => {
  const [user, setUser] = useState<User>();

  const { userName } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/users?userName=${userName}`;
    axios.get(URL).then(({ data }) => {
      setUser(data);
    });
  }, [userName]);

  if (!user) {
    return null;
  }

  return (
    <div className="lt-Profile">
      <p>Username: {user.userName}</p>
      <p>Class: {user.class}</p>
      <p>Questions Asked: {user.questions}</p>
      <p>Answers Given: {user.answers}</p>
      <p>Up Votes: {user.upVote}</p>
      <p>Down Votes: {user.downVote}</p>
    </div>
  );
};

export default Profile;