import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Util from '../../utils';
import axios from 'axios';
import { Answer } from '../../types';
import AnswerInput from '../../components/AnswerInput/AnswerInput';
import { Box, Button, Spinner, Text } from '@optiaxiom/react';

import './_index.scss';

const AnswerEdit = () => {
  const [answer, setAnswer] = useState<Answer>();
  const [loading, setLoading] = useState(true);
  const { answerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = `${Util.CONSTANTS.SERVER_URL}/answers/${answerId}`;
    axios
      .get(url)
      .then(({ data }) => {
        setAnswer(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [answerId]);

  if (loading) {
    return (
      <Box className="cl-AnswerEdit loading-container">
        <Spinner />
      </Box>
    );
  }

  if (!answer) {
    return (
      <Box className="cl-AnswerEdit error-container">
        <Text>Answer not found</Text>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box className="cl-AnswerEdit">
      <Box className="edit-header">
        <Button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <Text fontSize="2xl" fontWeight="600">
          Edit Your Answer
        </Text>
      </Box>
      <Box className="content-wrapper">
        <AnswerInput answer={answer} />
      </Box>
    </Box>
  );
};
export default AnswerEdit;
