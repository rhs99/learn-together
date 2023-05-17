import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Question } from '../../types';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import AuthContext from '../../store/auth';

const ChapterDetail = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigate = useNavigate();
  const { chapterId } = useParams();

  const {isLoggedIn} = useContext(AuthContext);

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
      {isLoggedIn && <button onClick={handleAskQuestion}>Ask Question</button>}
      <p>All Questions</p>
      {questions.map((question) => (
        <QuestionCard key={question._id} question={question} />
      ))}
    </div>
  );
};

export default ChapterDetail;
