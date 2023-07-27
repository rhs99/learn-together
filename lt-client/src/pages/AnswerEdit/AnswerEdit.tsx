import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Util from '../../utils';
import axios from 'axios';
import { Answer } from '../../types';
import AnswerInput from '../../components/AnswerInput/AnswerInput';

import './_index.scss';

const AnswerEdit = () => {
  const [answer, setAnswer] = useState<Answer>();
  const { answerId } = useParams();

  useEffect(() => {
    const url = `${Util.CONSTANTS.SERVER_URL}/answers/${answerId}`;
    axios.get(url).then(({ data }) => {
      setAnswer(data);
    });
  }, [answerId]);

  if (!answer) {
    return null;
  }

  return (
    <div className="cl-AnswerEdit">
      <AnswerInput answer={answer} />
    </div>
  );
};
export default AnswerEdit;
