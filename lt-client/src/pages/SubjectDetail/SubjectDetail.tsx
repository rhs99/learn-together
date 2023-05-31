import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Chapter } from '../../types';
import { Table, TableContainer, TableHead, TableRow, TableCell, Typography, TableBody } from '@mui/material';

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
    <TableContainer
      sx={{ width: '40%', border: 2, borderColor: 'rgb(231, 235, 240)', borderRadius: '3px', margin: '50px auto' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '50%' }}>
              <Typography fontSize={18} variant="caption">
                Chapters
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ width: '50%' }}>
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
              <TableCell align="center">0</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubjectDetail;
