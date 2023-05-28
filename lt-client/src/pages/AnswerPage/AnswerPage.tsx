import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Answer } from '../../types';
import Util from '../../utils';
import QACard from '../../components/QACard/QACard';
import axios from 'axios';

import './_index.scss';

const AnswerPage = () => {
  const [answer, setAnswer] = useState<Answer>();
  const { answerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/answers?answerId=${answerId}`;
    axios.get(URL).then(({ data }) => {
      setAnswer(data);
    });
  }, [answerId]);

  const handleAnswerDelete = () => {
    navigate(`/questions/${answer?.question}`);
  };

  if (!answer) {
    return null;
  }

  return (
    <div className="cl-AnswerPage">
      <QACard item={answer} handleItemDelete={handleAnswerDelete} isQuestion={false} clickableDetails={false} />;
    </div>
  );
};

export default AnswerPage;
