import { useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Table from '../../design-library/Table/Table';
import { Class } from '../../types';

import './_index.scss';

const HomePage = () => {
  const classes = useLoaderData();
  const navigate = useNavigate();

  const handleClassChange = (_id: string) => {
    navigate(`/classes/${_id}`);
  };

  const rowData = useMemo(() => {
    const rows: any = [{ value: ['Class Name', 'Subjects Available'] }];
    (classes as Class[]).forEach((_class) => {
      const data = {
        value: [_class.name, _class.subjects.length],
        options: { _id: _class._id },
      };
      rows.push(data);
    });
    return rows;
  }, [classes]);

  return (
    <div className="lt-Homepage">
      <div className="hero-section">
        <h1>Learn Together</h1>
        <p className="subtitle">Collaborative learning platform for students and educators</p>
        <div className="hero-actions">
          <button className="lt-button lt-button-primary" onClick={() => navigate('/users/signup')}>
            Join Now
          </button>
          <button className="lt-button lt-button-light" onClick={() => navigate('/about')}>
            Learn More
          </button>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="section-header">
          <h2>Available Classes</h2>
          <p>Select a class to explore subjects and learning materials</p>
        </div>
        <Table rowData={rowData} onRowSelection={handleClassChange} />
      </div>
    </div>
  );
};

export default HomePage;
