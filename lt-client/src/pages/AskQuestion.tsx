import { useParams } from 'react-router-dom';
import TextEditor from '../components/TextEditor/TextEditor';

const AskQuestion = () => {
  const { chapterId } = useParams();

  return <TextEditor chapterId={chapterId as string} />;
};

export default AskQuestion;
