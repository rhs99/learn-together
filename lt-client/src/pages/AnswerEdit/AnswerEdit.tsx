import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Util from '../../utils';
import axios from 'axios';
import { Answer } from '../../types';
import AnswerInput from '../../components/AnswerInput/AnswerInput';
import { Button, Spinner } from '@optiaxiom/react';

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
      <div className="cl-AnswerEdit loading-container">
        <Spinner />
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="cl-AnswerEdit error-container">
        <h2>Answer not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="cl-AnswerEdit">
      <div className="edit-header">
        <Button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <h1>Edit Your Answer</h1>
      </div>
      <div className="content-wrapper">
        <AnswerInput answer={answer} />
      </div>
    </div>
  );
};
export default AnswerEdit;
