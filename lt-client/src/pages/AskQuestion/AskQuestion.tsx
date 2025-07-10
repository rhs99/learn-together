import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import Util from '../../utils';
import { Breadcrumb } from '../../types';
import { Button } from '@optiaxiom/react';

import './_index.scss';

const AskQuestion = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [chapterName, setChapterName] = useState<string>('');

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/chapters/${chapterId}/breadcrumb`;
    axios.get(URL).then(({ data }) => {
      setBreadcrumbs(data);
      if (data.length > 0) {
        setChapterName(data[data.length - 1].name);
      }
    });
  }, [chapterId]);

  return (
    <div className="lt-AskQuestion">
      <div className="question-header">
        <div className="header-content">
          <Button className="back-button" onClick={() => navigate(`/chapters/${chapterId}`)}>
            ← Back to Chapter
          </Button>
          <h1>Ask a Question</h1>
          <p className="subtitle">
            {chapterName ? `Creating a new question in ${chapterName}` : 'Create a new question'}
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        <QuestionInput chapterId={chapterId as string} />
      </div>
    </div>
  );
};

export default AskQuestion;
