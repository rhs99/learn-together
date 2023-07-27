import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Chapter, Breadcrumb } from '../../types';
import { Table, TableContainer, TableHead, TableRow, TableCell, Typography, TableBody } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

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
          {<Typography>{breadcrumbs[breadcrumbs.length - 1].name}</Typography>}
        </Breadcrumbs>
      )}
      <TableContainer sx={{ border: 2, borderColor: 'rgb(231, 235, 240)', borderRadius: '3px', marginTop: '20PX' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontSize={18} variant="caption">
                  Chapters
                </Typography>
              </TableCell>
              <TableCell sx={{ width: '10%' }}>
                <Typography fontSize={18} variant="caption">
                  Questions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chapters.map((chapter) => (
              <TableRow
                key={chapter._id}
                onClick={() => handleChapterOpen(chapter._id)}
                sx={{ ':hover': { cursor: 'pointer', backgroundColor: 'rgb(231, 235, 240)' } }}
              >
                <TableCell>{chapter.name}</TableCell>
                <TableCell>{chapter.questionsCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SubjectDetail;
