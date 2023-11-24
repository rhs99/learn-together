import { useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Table from '../../design-library/Table/Table';
import { Class } from '../../types';

import './_index.scss';

const HoomePage = () => {
  const classes = useLoaderData();
  const navigate = useNavigate();

  const handleClassChange = (_id: string) => {
    navigate(`/classes/${_id}`);
  };

  const rowData = useMemo(() => {
    const rows: any = [{ value: ['Class', 'Subjects'] }];
    (classes as Class[]).forEach((_class) => {
      const data = { value: [_class.name, _class.subjects.length], options: { _id: _class._id } };
      rows.push(data);
    });
    return rows;
  }, [classes]);

  return (
    <div className="lt-Homepage">
      <Table rowData={rowData} onRowSelection={handleClassChange} />
    </div>
  );
};

export default HoomePage;
