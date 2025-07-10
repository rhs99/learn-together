import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { User } from '../../types';

import './_index.scss';

const Profile = () => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);

  const { userName } = useParams();

  useEffect(() => {
    setIsLoading(true);
    const URL = `${Util.CONSTANTS.SERVER_URL}/users/${userName}`;
    axios
      .get(URL)
      .then(({ data }) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch user profile:', error);
        setIsLoading(false);
      });
  }, [userName]);

  if (isLoading) {
    return <div className="lt-Profile__loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="lt-Profile__error">User not found</div>;
  }

  return (
    <div className="lt-Profile">
      <div className="lt-Profile__container">
        <div className="lt-Profile__header">
          <div className="lt-Profile__avatar">{user.userName?.charAt(0).toUpperCase()}</div>
          <h1 className="lt-Profile__username">{user.userName}</h1>
          {user.class && <div className="lt-Profile__class">{user.class}</div>}
        </div>

        <div className="lt-Profile__stats">
          <div className="lt-Profile__stat-card">
            <span className="lt-Profile__stat-value">{user.questions || 0}</span>
            <span className="lt-Profile__stat-label">Questions</span>
          </div>
          <div className="lt-Profile__stat-card">
            <span className="lt-Profile__stat-value">{user.answers || 0}</span>
            <span className="lt-Profile__stat-label">Answers</span>
          </div>
          <div className="lt-Profile__stat-card">
            <span className="lt-Profile__stat-value">{user.upVote || 0}</span>
            <span className="lt-Profile__stat-label">Upvotes</span>
          </div>
          <div className="lt-Profile__stat-card">
            <span className="lt-Profile__stat-value">{user.downVote || 0}</span>
            <span className="lt-Profile__stat-label">Downvotes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
