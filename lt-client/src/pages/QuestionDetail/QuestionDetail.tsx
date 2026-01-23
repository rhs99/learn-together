import { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Flex } from '@optiaxiom/react';
import { Question, Answer } from '../../types';
import AuthContext from '../../store/auth';
import Util from '../../utils';
import AnswerInput from '../../components/AnswerInput/AnswerInput';
import QACard from '../../components/QACard/QACard';

const QuestionDetail = () => {
  const [question, setQuestion] = useState<Question>();
  const [answers, setAnswers] = useState<Answer[]>([]);

  const navigate = useNavigate();
  const { questionId } = useParams();

  const { isLoggedIn, getStoredValue } = useContext(AuthContext);

  const fetchAnswers = useCallback(async () => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/answers?questionId=${questionId}`;
    return axios.get(URL).then(({ data }) => data);
  }, [questionId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/questions/${questionId}`;
    axios.get(URL).then(({ data }) => {
      setQuestion(data);
    });
    fetchAnswers().then((data) => setAnswers(data));
  }, [questionId, fetchAnswers]);

  const handleAnsPost = async () => {
    fetchAnswers().then((data) => setAnswers(data));
  };

  const handleQuestionDelete = () => {
    navigate(`/chapters/${question?.chapter}`);
  };

  const handleAnswerDelete = (_id: string) => {
    setAnswers((prev) => {
      return prev.filter((a) => a._id !== _id);
    });
  };

  const isOwner = getStoredValue().userName === question?.userName;

  if (!question) {
    return null;
  }

  return (
    <Box w="full" my="32">
      <Flex flexDirection="column" gap="24">
        <QACard item={question} clickableDetails={false} isQuestion={true} handleItemDelete={handleQuestionDelete} />
        {isLoggedIn && !isOwner && (
          <AnswerInput
            fetchAnswer={handleAnsPost}
            answer={{ _id: '', question: questionId || '', imageLocations: [] }}
          />
        )}
        <Heading level="2" fontSize="xl" fontWeight="600" mb="16">
          {`${answers.length} Answers`}
        </Heading>
        {answers.map((answer) => (
          <QACard
            key={answer._id}
            item={answer}
            clickableDetails={false}
            isQuestion={false}
            handleItemDelete={handleAnswerDelete}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default QuestionDetail;
