import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Util from '../../utils';
import { Question } from '../../types';
import QuestionInput from '../../components/QuestionInput/QuestionInput';

import './_index.scss';

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

  return (
    <div className="lt-QuestionEdit">
      <QuestionInput chapterId={question.chapter} question={question} />
    </div>
  );
};
export default QuestionEdit;
