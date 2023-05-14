import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Chapter } from '../../types';

const SubjectDetail = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const navigate = useNavigate();
  const { subjectId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/chapters/list?subjectId=${subjectId}`;
    axios.get(URL).then(({ data }) => {
      setChapters(data);
    });
  }, [subjectId]);

  const handleChapterOpen = (id: string) => {
    navigate(`/chapters/${id}`);
  };

  return (
    <div>
      <p>List of Chapters</p>
      {chapters.map((chapter) => (
        <div key={chapter._id}>
          <button onClick={() => handleChapterOpen(chapter._id)}>{chapter.name}</button>
        </div>
      ))}
    </div>
  );
};

export default SubjectDetail;
