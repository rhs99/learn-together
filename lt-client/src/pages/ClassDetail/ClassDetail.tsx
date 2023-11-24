import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Subject } from '../../types';
import { TableContainer, TableHead, TableRow, TableCell, Typography, TableBody } from '@mui/material';
import Table from '../../design-library/Table/Table';

import './_index.scss';

const ClassDetail = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [className, setClassName] = useState();
  const navigate = useNavigate();
  const { classId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/subjects?classId=${classId}`;
    axios.get(URL).then(({ data }) => {
      setSubjects(data);
    });
  }, [classId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/classes/${classId}`;
    axios.get(URL).then(({ data }) => {
      setClassName(data.name);
    });
  }, [classId]);

  const handleSubjectClick = (id: string) => {
    navigate(`/subjects/${id}`);
  };

  const rowData = useMemo(() => {
    const rows: any = [{ value: ['Subject', 'Chapters'] }];
    subjects.forEach((sub) => {
      const data = { value: [sub.name, sub.chapters.length], options: { _id: sub._id } };
      rows.push(data);
    });
    return rows;
  }, [subjects]);

  return (
    <div className="lt-ClassDetail">
      <p>{className}</p>
      <Table rowData={rowData} onRowSelection={handleSubjectClick} />
    </div>
  );
};

export default ClassDetail;
