import { useLoaderData, useNavigate } from 'react-router-dom';
import { Class } from '../types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';

const HoomePage = () => {
  const classes = useLoaderData();
  const navigate = useNavigate();

  const handleClassChange = (_id: string) => {
    navigate(`/classes/${_id}`);
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
                Class
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ width: '50%' }}>
              <Typography fontSize={18} variant="caption">
                Subjects
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(classes as Class[]).map((_class) => (
            <TableRow
              key={_class._id}
              onClick={() => handleClassChange(_class._id)}
              sx={{ ':hover': { cursor: 'pointer', backgroundColor: 'rgb(231, 235, 240)' } }}
            >
              <TableCell>{_class.name}</TableCell>
              <TableCell align="center">{_class.subjects.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HoomePage;
