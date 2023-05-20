import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Answer } from '../types';
import Util from '../utils';
import AnswerCard from '../components/AnswerCard/AnswerCard';
import axios from 'axios';

const AnswerPage = () => {
  const [answer, setAnswer] = useState<Answer>();
  const { answerId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/answers?answerId=${answerId}`;
    axios.get(URL).then(({ data }) => {
      setAnswer(data);
    });
  }, [answerId]);

  if (!answer) {
    return null;
  }

  return <AnswerCard answer={answer} />;
};

export default AnswerPage;
