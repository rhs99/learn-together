import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Util from '../../utils';
import { Question } from '../../types';
import QuestionInput from '../../components/QuestionInput/QuestionInput';

import './_index.scss';
import { Box } from '@optiaxiom/react';

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
    <Box className="lt-QuestionEdit">
      <QuestionInput chapterId={question.chapter} question={question} />
    </Box>
  );
};
export default QuestionEdit;
