import { useEffect, useState, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Question, Answer } from '../../types';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import AnswerCard from '../../components/AnswerCard/AnswerCard';
import { Typography } from '@mui/material';
import AuthContext from '../../store/auth';
import Util from '../../utils';
import AnswerInput from '../../components/AnswerInput/AnswerInput';

import './_index.scss';

const QuestionDetail = () => {
  const [question, setQuestion] = useState<Question>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const { questionId } = useParams();

  const { isLoggedIn } = useContext(AuthContext);

  const fetchAnswers = useCallback(async () => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/answers/list?questionId=${questionId}`;
    return axios.get(URL).then(({ data }) => data);
  }, [questionId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/questions?questionId=${questionId}`;
    axios.get(URL).then(({ data }) => {
      setQuestion(data);
    });
    fetchAnswers().then((data) => setAnswers(data));
  }, [questionId, fetchAnswers]);

  const handleAnsPost = async () => {
    fetchAnswers().then((data) => setAnswers(data));
  };

  if (!question) {
    return null;
  }

  return (
    <div className="cl-QuestionDetail">
      <QuestionCard question={question} qdClickable={false} />
      {isLoggedIn && (
        <AnswerInput
          fetchAnswer={handleAnsPost}
          answer={{ _id: '', question: questionId || '', imageLocations: [], details: '' }}
        />
      )}
      <Typography variant="h5" className="ans-title">
        All Answers
      </Typography>
      {answers.map((answer) => (
        <AnswerCard key={answer._id} answer={answer} />
      ))}
    </div>
  );
};

export default QuestionDetail;
