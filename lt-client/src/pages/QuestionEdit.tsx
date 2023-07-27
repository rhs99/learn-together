import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Util from '../utils';
import axios from 'axios';
import { Question } from '../types';
import QuestionInput from '../components/QuestionInput/QuestionInput';

const QuestionEdit = () => {
  const [question, setQuestion] = useState<Question>();
  const { questionId } = useParams();

  useEffect(() => {
    const url = `${Util.CONSTANTS.SERVER_URL}/questions/${questionId}`;
    axios.get(url).then(({ data }) => {
      setQuestion(data);
    });
  }, [questionId]);

  if (!question) {
    return null;
  }

  return <QuestionInput chapterId={question.chapter} question={question} />;
};
export default QuestionEdit;
