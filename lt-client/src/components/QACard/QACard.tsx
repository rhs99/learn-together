import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Divider, Chip, Modal, Box, IconButton, Tooltip, Snackbar, Alert, Button } from '@mui/material';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { Question, Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';
import ReactQuill from 'react-quill';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import './_index.scss';

type QACardProps = {
  item: Question | Answer;
  isQuestion: boolean;
  clickableDetails: boolean;
  handleItemDelete: (_id: string) => void;
};

const QACard = ({ item, isQuestion, clickableDetails, handleItemDelete }: QACardProps) => {
  const [fileData, setFileData] = useState<string[]>([]);
  const [imageToShow, setImageToShow] = useState<string>('');
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [udCnt, setUdCnt] = useState({ upVote: item.upVote, downVote: item.downVote });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleImageModalOpen = (url: string) => {
    setImageToShow(url);
  };

  const handleImageModalClose = () => {
    setImageToShow('');
  };

  useEffect(() => {
    if (item.imageLocations.length === 0) {
      return;
    }
    Util.minioClient.getObject(Util.CONSTANTS.MINIO_BUCKET, item.imageLocations[0], (err: any, dataStream1: any) => {
      if (err) {
        console.log(err);
        return;
      }
      if (item.imageLocations.length > 1) {
        Util.minioClient.getObject(
          Util.CONSTANTS.MINIO_BUCKET,
          item.imageLocations[1],
          (err: any, dataStream2: any) => {
            if (err) {
              console.log(err);
              return;
            }
            setFileData([dataStream1.url, dataStream2.url]);
          }
        );
      } else {
        setFileData([dataStream1.url]);
      }
    });
  }, [item.imageLocations]);

  const handleItemDetailsClick = () => {
    if (isQuestion) navigate(`/questions/${item._id}`);
  };

  const handleShareClick = () => {
    const url = `${Util.CONSTANTS.CLIENT_URL}/${isQuestion ? 'questions' : 'answers'}/${item._id}`;
    navigator.clipboard.writeText(url);
    setShowShareAlert(true);
  };

  const handleUpVote = async () => {
    const url = `${Util.CONSTANTS.SERVER_URL}/votes/update`;
    const payload = {
      qaId: item._id,
      up: true,
      q: isQuestion,
    };

    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setUdCnt(data);
  };

  const handleDownVote = async () => {
    const url = `${Util.CONSTANTS.SERVER_URL}/votes/update`;
    const payload = {
      qaId: item._id,
      up: false,
      q: isQuestion,
    };

    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setUdCnt(data);
  };

  const handleEdit = () => {
    navigate(`/${isQuestion ? 'questions' : 'answers'}/${item._id}/edit`);
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const deleteImageLocations = async () => {
    const images = item.imageLocations;
    if (isQuestion) {
      const URL = `${Util.CONSTANTS.SERVER_URL}/answers/list?questionId=${item._id}`;
      const { data } = await axios.get(URL);
      (data as Answer[]).forEach((answer) => {
        images.push(...answer.imageLocations);
      });
    }
    images.forEach((image) => {
      Util.deleteFile(image);
    });
  };

  const handleConfirmDelete = async () => {
    await deleteImageLocations();
    const url = `${Util.CONSTANTS.SERVER_URL}/${isQuestion ? 'questions' : 'answers'}/${item._id}`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        },
      })
      .then(() => {
        handleItemDelete(item._id);
      });
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
  };

  const isOwner = authCtx.getStoredValue().userName === item.user.userName;

  const detailsClassName = clickableDetails ? 'detailsClickable' : '';
  const detailsOnClick = clickableDetails ? handleItemDetailsClick : undefined;

  return (
    <div className="cl-QACard">
      <Snackbar open={showShareAlert} autoHideDuration={1000} onClose={() => setShowShareAlert(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
      <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <div className="left-pane">
          <div className="UD-container">
            <Tooltip title="Up vote">
              <IconButton onClick={handleUpVote}>
                <ChangeHistoryIcon />
              </IconButton>
            </Tooltip>
            <div className="net-cnt">
              <Typography>{udCnt.upVote - udCnt.downVote}</Typography>
            </div>
            <Tooltip title="Down vote">
              <IconButton onClick={handleDownVote}>
                <ChangeHistoryIcon className="down-icon" />
              </IconButton>
            </Tooltip>
          </div>
          <div className="info">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Up vote</TableCell>
                  <TableCell>{udCnt.upVote}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Down vote</TableCell>
                  <TableCell>{udCnt.downVote}</TableCell>
                </TableRow>
                {isQuestion && (
                  <TableRow>
                    <TableCell>Answers</TableCell>
                    <TableCell>{(item as Question).answers.length}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="right-pane">
          <div className={detailsClassName} onClick={detailsOnClick}>
            <ReactQuill value={item.details} readOnly={true} theme={'bubble'} />
          </div>
          <Divider />
          <div className="imageContainer">
            {fileData.map((file, index) => (
              <img key={index} src={file} className="image" onClick={() => handleImageModalOpen(file)} />
            ))}
          </div>
          {isQuestion && <Divider />}
          {isQuestion && (
            <div className="tags">
              <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem className="divider" />}
              >
                {(item as Question).tags.map((tag) => (
                  <Chip key={tag._id} variant="outlined" size="small" label={tag.name} className="tag" />
                ))}
              </Stack>
            </div>
          )}
        </div>
      </Stack>
      <div className="bottom-pane">
        <Typography variant="body2" className="author">
          {`${isQuestion ? 'asked' : 'answered'} by`} <span className="user-name">{item.user.userName}</span>
        </Typography>
        <Tooltip title="share">
          <IconButton className="share" onClick={handleShareClick}>
            <ShareIcon fontSize="small"></ShareIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title="edit">
          <IconButton className="edit" disabled={!isOwner} onClick={handleEdit}>
            <EditIcon fontSize="small"></EditIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title="delete">
          <IconButton className="delete" disabled={!isOwner} onClick={handleDelete}>
            <DeleteIcon fontSize="small"></DeleteIcon>
          </IconButton>
        </Tooltip>
      </div>
      {imageToShow.length > 0 && (
        <Modal open={imageToShow.length > 0} onClose={handleImageModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              bgcolor: 'background.paper',
              border: '2px solid grey',
            }}
          >
            <img src={imageToShow} style={{ width: '100%', height: 'auto' }} />
          </Box>
        </Modal>
      )}
      {openDeleteModal && (
        <Modal open={openDeleteModal} onClose={handleDeleteModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '400px',
              bgcolor: 'background.paper',
              borderRadius: '5px',
              padding: '15px',
            }}
          >
            <Typography variant="h6">Do you want to delete this question?</Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button onClick={handleDeleteModalClose} color="secondary">
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                Confirm
              </Button>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default QACard;
