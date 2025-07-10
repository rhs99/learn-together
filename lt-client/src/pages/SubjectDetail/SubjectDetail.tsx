import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Chapter, Breadcrumb } from '../../types';
import Table from '../../design-library/Table/Table';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

import './_index.scss';

const SubjectDetail = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const navigate = useNavigate();
  const { subjectId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/chapters?subjectId=${subjectId}`;
    axios.get(URL).then(({ data }) => {
      setChapters(data);
    });
  }, [subjectId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/subjects/${subjectId}/breadcrumb`;
    axios.get(URL).then(({ data }) => {
      setBreadcrumbs(data);
    });
  }, [subjectId]);

  const handleChapterOpen = (id: string) => {
    navigate(`/chapters/${id}`);
  };

  const rowData = useMemo(() => {
    const rows: any = [{ value: ['Chapter', 'Questions'] }];
    chapters.forEach((chap) => {
      const data = { value: [chap.name, chap.questionsCount], options: { _id: chap._id } };
      rows.push(data);
    });
    return rows;
  }, [chapters]);

  return (
    <div className="lt-SubjectDetail">
      <div className="subject-header">
        <div className="header-content">
          {breadcrumbs.length > 0 && (
            <Breadcrumbs
              items={breadcrumbs.map((breadcrumb, index) => ({
                name: breadcrumb.name,
                url: index < breadcrumbs.length - 1 ? breadcrumb.url : null,
              }))}
            />
          )}
          <h1>{breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : 'Subject Detail'}</h1>
          <p className="description">Explore chapters and learning materials for this subject</p>
        </div>
        <button
          className="lt-button lt-button-secondary"
          onClick={() => navigate(`/classes/${breadcrumbs[0]?.url.split('/').pop()}`)}
        >
          Back to Subjects
        </button>
      </div>

      <div className="content-wrapper">
        <div className="section-header">
          <h2>Available Chapters</h2>
          <p>Select a chapter to view questions and learning materials</p>
        </div>
        <div className="table-container">
          <Table rowData={rowData} onRowSelection={handleChapterOpen} />
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
