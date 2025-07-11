import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Subject } from '../../types';
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
    const rows = [{ value: ['Subject', 'Chapters'] }];
    subjects.forEach((sub) => {
      const data = { value: [sub.name, String(sub.chapters.length)], options: { _id: sub._id } };
      rows.push(data);
    });
    return rows;
  }, [subjects]);

  return (
    <div className="lt-ClassDetail">
      <div className="class-header">
        <div className="header-content">
          <h1>{className}</h1>
          <p className="description">Explore subjects and learning materials for this class</p>
        </div>
        <button className="lt-button lt-button-secondary" onClick={() => navigate('/')}>
          Back to Classes
        </button>
      </div>

      <div className="content-wrapper">
        <div className="section-header">
          <h2>Available Subjects</h2>
          <p>Select a subject to view chapters and learning materials</p>
        </div>
        <div className="table-container">
          <Table rowData={rowData} onRowSelection={handleSubjectClick} />
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
