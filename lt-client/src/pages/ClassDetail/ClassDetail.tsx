import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Subject } from '../../types';
import { Table, TableContainer, TableHead, TableRow, TableCell, Typography, TableBody } from '@mui/material';

const ClassDetail = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const navigate = useNavigate();
  const { classId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/subjects/list?classId=${classId}`;
    axios.get(URL).then(({ data }) => {
      setSubjects(data);
    });
  }, [classId]);

  const handleSubjectClick = (id: string) => {
    navigate(`/subjects/${id}`);
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
                Subjects
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ width: '50%' }}>
              <Typography fontSize={18} variant="caption">
                Chapters
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow
              key={subject._id}
              onClick={() => handleSubjectClick(subject._id)}
              sx={{ ':hover': { cursor: 'pointer', backgroundColor: 'rgb(231, 235, 240)' } }}
            >
              <TableCell>{subject.name}</TableCell>
              <TableCell align="center">{subject.chapters.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClassDetail;
