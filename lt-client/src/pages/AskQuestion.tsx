import { useParams } from 'react-router-dom';
import QuestionInput from '../components/QuestionInput/TextEditor';

const AskQuestion = () => {
  const { chapterId } = useParams();

  return <QuestionInput chapterId={chapterId as string} />;
};

export default AskQuestion;
