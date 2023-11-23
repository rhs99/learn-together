import { useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Table from '../../design-library/Table';
import { Class } from '../../types';

import './_index.scss';

const HoomePage = () => {
  const classes = useLoaderData();
  const navigate = useNavigate();

  const handleClassChange = (_class: Class) => {
    navigate(`/classes/${_class._id}`);
  };

  const columnDefs = [{ field: 'class' }, { field: 'subjects' }];

  const rowData = useMemo(() => {
    return (classes as Class[]).map((_class) => ({
      class: _class.name,
      subjects: _class.subjects.length,
      _id: _class._id,
    }));
  }, [classes]);

  return <Table columnDefs={columnDefs} rowData={rowData} className="lt-Homepage" onRowSelection={handleClassChange} />;
};

export default HoomePage;
