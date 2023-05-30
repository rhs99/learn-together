import { useLoaderData, useNavigate } from 'react-router-dom';
import { Class } from '../types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
      <TableContainer sx={{ width: 650, border: 1, borderColor: 'lightgray' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Class</TableCell>
              <TableCell align="right" sx={{ borderLeft: 1, borderColor: 'lightgray' }}>
                Total subjects
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(classes as Class[]).map((_class) => (
              <TableRow
                key={_class._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleClassChange(_class._id)}
              >
                <TableCell>{_class.name}</TableCell>
                <TableCell align="right" sx={{ borderLeft: 1, borderColor: 'lightgray' }}>
                  {_class.subjects ? _class.subjects.length : 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HoomePage;
