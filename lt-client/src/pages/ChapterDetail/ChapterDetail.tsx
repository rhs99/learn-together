import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import parse from 'html-react-parser';
import { Question } from '../../types';
import QuestionCard from '../../components/QuestionCard/QuestionCard';

const ChapterDetail = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();
  const { chapterId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/questions/list?chapterId=${chapterId}`;
    axios.get(URL).then(({ data }) => {
      setQuestions(data);
    });
  }, [chapterId]);

  const handleAskQuestion = () => {
    navigate(`/chapters/${chapterId}/ask`);
  };

  return (
    <div>
      <button onClick={handleAskQuestion}>Ask Question</button>
      <p>All Questions</p>
      {questions.map((question) => (
        <QuestionCard key={question._id} question={question} />
      ))}
    </div>
  );
};

export default ChapterDetail;
