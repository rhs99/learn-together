import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Questiion } from '../../types';

const ChapterDetail = () => {
  const [questions, setQuestions] = useState<Questiion[]>([]);
  const navigate = useNavigate();
  const { chapterId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/questions/list?chapterId=${chapterId}`;
    axios.get(URL).then(({ data }) => {
      setQuestions(data);
    });
  }, [chapterId]);

  return (
    <div>
      <p>Let&apos;s Learn Together</p>
      <p>List of Questions</p>
      {questions.map((question) => (
        <div key={question._id}>
          <p>{question.details}</p>
        </div>
      ))}
    </div>
  );
};

export default ChapterDetail;
