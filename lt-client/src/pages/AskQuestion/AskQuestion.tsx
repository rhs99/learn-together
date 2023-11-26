import { useParams } from 'react-router-dom';
import QuestionInput from '../../components/QuestionInput/QuestionInput';

import './_index.scss';

const AskQuestion = () => {
  const { chapterId } = useParams();

  return (
    <div className="lt-AskQuestion">
      <QuestionInput chapterId={chapterId as string} />
    </div>
  );
};

export default AskQuestion;
