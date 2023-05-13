import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Subject } from '../../types';

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

  return (
    <div>
      <p>Let&apos;s Learn Together</p>
      <p>List of Subjects</p>
      {subjects.map((subject) => (
        <div key={subject._id}>
          <button>{subject.name}</button>
        </div>
      ))}
    </div>
  );
};

export default ClassDetail;
