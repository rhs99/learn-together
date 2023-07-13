import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Subject } from '../../types';
import { Table, TableContainer, TableHead, TableRow, TableCell, Typography, TableBody } from '@mui/material';

import './_index.scss';

const ClassDetail = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [className, setClassName] = useState();
  const navigate = useNavigate();
  const { classId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/subjects/list?classId=${classId}`;
    axios.get(URL).then(({ data }) => {
      setSubjects(data);
    });
  }, [classId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/classes/${classId}/name`;
    axios.get(URL).then(({ data }) => {
      setClassName(data);
    });
  }, [classId]);

  const handleSubjectClick = (id: string) => {
    navigate(`/subjects/${id}`);
  };

  return (
    <div className="lt-ClassDetail">
      <Typography>{className}</Typography>
      <TableContainer sx={{ border: 2, borderColor: 'rgb(231, 235, 240)', borderRadius: '3px', marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontSize={18} variant="caption">
                  Subjects
                </Typography>
              </TableCell>
              <TableCell sx={{ width: '20%' }}>
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
                <TableCell>{subject.chapters.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClassDetail;
