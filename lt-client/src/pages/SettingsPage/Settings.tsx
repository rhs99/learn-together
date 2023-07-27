import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { Class, Privilege, Subject } from '../../types';
import { FormEvent, useContext, useEffect, useState } from 'react';
import Util from '../../utils';
import AuthContext from '../../store/auth';
import { Alert } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './_index.scss';

const Settings = () => {
  const [prevPassword, setPrevPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [_class, setClass] = useState('');
  const [newClass, setNewClass] = useState('');
  const [classForSubject, setClassForSubject] = useState('');
  const [subjectForChapter, setSubjectForChapter] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [hasAdminPrivilege, setHasAdminPrivilege] = useState(false);
  const [newPrivilege, setNewPrivilege] = useState('');
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [userName, setUserName] = useState('');

  const [alert, setAlert] = useState<{ showAlert: boolean; type: string; msg: string }>({
    showAlert: false,
    type: '',
    msg: '',
  });

  const classes = useLoaderData();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    let URL = `${Util.CONSTANTS.SERVER_URL}/users/${authCtx.getStoredValue().userName}`;
    axios.get(URL).then(({ data }) => {
      data.privileges.forEach((privilege: Privilege) => {
        if (privilege.name === 'admin') {
          setHasAdminPrivilege(true);
          return;
        }
      });
    });

    URL = `${Util.CONSTANTS.SERVER_URL}/privileges`;
    axios.get(URL).then(({ data }) => {
      setPrivileges(data);
    });
  }, []);

  const fetchSubjects = async (classId: string) => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/subjects?classId=${classId}`;
    axios.get(URL).then(({ data }) => {
      setSubjects(data);
    });
  };

  const handleAddPrivilege = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/privileges`;

    const payload = {
      name: newPrivilege,
    };

    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Privilege created!',
        });
      })
      .catch(() => {
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Privilege creation failed!',
        });
      });
  };

  const handleChangeClass = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/users/update-class`;
    const payload = {
      userName: authCtx.getStoredValue().userName,
      _class: _class,
    };

    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Class updated successfully!',
        });
      })
      .catch(() => {
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Class update failed!',
        });
      });
    setClass('');
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setAlert({
        showAlert: true,
        type: 'info',
        msg: 'New Password and Confirm Password must match!',
      });
      return;
    }

    const url = `${Util.CONSTANTS.SERVER_URL}/users/update-password`;
    const payload = {
      userName: authCtx.getStoredValue().userName,
      prevPassword: prevPassword,
      password: password,
    };

    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Password changed successfully!',
        });
      })
      .catch(() => {
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Password update failed!',
        });
      });
    setPrevPassword('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleAddClass = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/classes`;
    const payload = {
      name: newClass,
    };
    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Class created successfully!',
        });
      })
      .catch(() => {
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Class create failed!',
        });
      });
    setNewClass('');
  };

  const handleAddSubject = async (event: FormEvent) => {
    event.preventDefault();
    const url = `${Util.CONSTANTS.SERVER_URL}/subjects`;
    const payload = {
      name: newSubject,
      class: classForSubject,
    };
    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Subject created successfully!',
        });
      })
      .catch(() => {
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Subject creation failed!',
        });
      });
    setNewSubject('');
    setClassForSubject('');
  };

  const handleAddChapter = async (event: FormEvent) => {
    event.preventDefault();

    const url = `${Util.CONSTANTS.SERVER_URL}/chapters`;
    const payload = {
      name: newChapter,
      subject: subjectForChapter,
    };
    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Chapter created successfully!',
        });
      })
      .catch(() => {
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Chapter creation failed!',
        });
      });
    setNewChapter('');
    setSubjectForChapter('');
  };

  const handleChangePrivilege = async (event: FormEvent) => {
    event.preventDefault();

    const url = `${Util.CONSTANTS.SERVER_URL}/users/updatePrivilege`;

    const payload = {
      userName,
      privileges: [newPrivilege],
    };

    await axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setAlert({
          showAlert: true,
          type: 'success',
          msg: 'Privilege updated!',
        });
      })
      .catch(() => {
        setAlert({
          showAlert: true,
          type: 'error',
          msg: 'Privilege update failed!',
        });
      });
    setUserName('');
    setNewPrivilege('');
  };

  return (
    <div className="lt-settings">
      {alert.showAlert && (
        <Alert
          sx={{ marginTop: '10px', width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
          severity={alert.type === 'error' ? 'error' : alert.type === 'success' ? 'success' : 'info'}
          onClose={() => {
            setAlert({
              showAlert: false,
              type: '',
              msg: '',
            });
          }}
        >
          {alert.msg}
        </Alert>
      )}
      <Accordion sx={{ marginTop: '10px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
          <Typography>Change Class</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleChangeClass}>
            <select value={_class} onChange={(event) => setClass(event.target.value)} name="class" required>
              <option value="">Select class</option>
              {(classes as Class[]).map((_class) => (
                <option value={_class._id} key={_class._id}>
                  {_class.name}
                </option>
              ))}
            </select>
            <button type="submit">Change</button>
          </form>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ marginTop: '10px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
          <Typography>Change Password</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleChangePassword}>
            <label htmlFor="password">Previous Password</label>
            <input
              type="password"
              name="prevPassword"
              value={prevPassword}
              onChange={(event) => setPrevPassword(event.target.value)}
              required
            />
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <button type="submit">Change</button>
          </form>
        </AccordionDetails>
      </Accordion>
      {hasAdminPrivilege && (
        <>
          <Accordion sx={{ marginTop: '10px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
              <Typography>Create Privilege</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleAddPrivilege}>
                <input
                  type="text"
                  name="addPrivilege"
                  value={newPrivilege}
                  onChange={(event) => setNewPrivilege(event.target.value)}
                  required
                />
                <button type="submit">Add</button>
              </form>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ marginTop: '10px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
              <Typography>Give Privilege</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleChangePrivilege}>
                <label htmlFor="add-username">Username</label>
                <input
                  type="text"
                  name="addUsername"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  required
                />
                <label htmlFor="change-privilege">Select privilege</label>
                <select
                  value={newPrivilege}
                  onChange={(event) => setNewPrivilege(event.target.value)}
                  name="privilege"
                  required
                >
                  <option value="">Select privilege</option>
                  {privileges.map((privilege) => (
                    <option value={privilege._id} key={privilege._id}>
                      {privilege.name}
                    </option>
                  ))}
                </select>
                <button type="submit">Add</button>
              </form>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ marginTop: '10px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
              <Typography>Add New Class</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleAddClass}>
                <label htmlFor="add-class">Class Name</label>
                <input
                  type="text"
                  name="addClass"
                  value={newClass}
                  onChange={(event) => setNewClass(event.target.value)}
                  required
                />
                <button type="submit">Add</button>
              </form>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ marginTop: '10px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
              <Typography>Add New Subject</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleAddSubject}>
                <label htmlFor="check-class">Class Name</label>
                <select
                  value={classForSubject}
                  onChange={(event) => setClassForSubject(event.target.value)}
                  name="class"
                  required
                >
                  <option value="">Select class</option>
                  {(classes as Class[]).map((_class) => (
                    <option value={_class._id} key={_class._id}>
                      {_class.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="add-subject">Subject Name</label>
                <input
                  type="text"
                  name="addSubject"
                  value={newSubject}
                  onChange={(event) => setNewSubject(event.target.value)}
                  required
                />
                <button type="submit">Add</button>
              </form>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ marginTop: '10px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
              <Typography>Add New Chapter</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleAddChapter}>
                <label htmlFor="check-class">Class Name</label>
                <select
                  value={classForSubject}
                  onChange={async (event) => {
                    setClassForSubject(event.target.value);
                    await fetchSubjects(event.target.value);
                  }}
                  name="class"
                  required
                >
                  <option value="">Select class</option>
                  {(classes as Class[]).map((_class) => (
                    <option value={_class._id} key={_class._id}>
                      {_class.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="check-subject">Select subject</label>
                <select
                  value={subjectForChapter}
                  onChange={(event) => setSubjectForChapter(event.target.value)}
                  name="subject"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option value={subject._id} key={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="add-chapter">Chapter Name</label>
                <input
                  type="text"
                  name="addChapter"
                  value={newChapter}
                  onChange={(event) => setNewChapter(event.target.value)}
                  required
                />
                <button type="submit">Add</button>
              </form>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </div>
  );
};

export default Settings;
