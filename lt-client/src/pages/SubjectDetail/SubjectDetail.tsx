import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Chapter, Breadcrumb } from '../../types';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Table from '../../design-library/Table/Table';

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
      {breadcrumbs.length > 0 && (
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs.slice(0, -1).map((breadcrumb) => {
            return (
              <Link key={breadcrumb.name} href={breadcrumb.url} underline="hover">
                {breadcrumb.name}
              </Link>
            );
          })}
          {<span>{breadcrumbs[breadcrumbs.length - 1].name}</span>}
        </Breadcrumbs>
      )}
      <Table rowData={rowData} onRowSelection={handleChapterOpen} />
    </div>
  );
};

export default SubjectDetail;
