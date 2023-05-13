import { useLoaderData, useNavigate } from 'react-router-dom';
import { Class } from '../types';

const HoomePage = () => {
  const classes = useLoaderData();
  const navigate = useNavigate();

  const handleClassChange = (_id: string) => {
    navigate(`/classes/${_id}`);
  };

  return (
    <div>
      <p>Let&apos;s Learn Together</p>
      <p>List of Classes</p>
      {(classes as Class[]).map((_class) => (
        <button key={_class._id} onClick={() => handleClassChange(_class._id)}>
          {_class.name}
        </button>
      ))}
    </div>
  );
};

export default HoomePage;
