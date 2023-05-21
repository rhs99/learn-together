import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import parse from 'html-react-parser';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Divider, Modal, Box, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { Answer } from '../../types';
import axios from 'axios';
import Util from '../../utils';
import AuthContext from '../../store/auth';

import './_index.scss';

type AnswerCardProps = {
  answer: Answer;
};

const AnswerCard = (props: AnswerCardProps) => {
  const [fileData, setFileData] = useState(null);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [showShareAlert, setShowShareAlert] = useState(false);
  const [netCnt, setNetCnt] = useState(props.answer.upVote - props.answer.downVote);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInageModalOpen = () => {
    setShowImageModal(true);
  };

  const handleInageModalClose = () => {
    setShowImageModal(false);
  };

  useEffect(() => {
    let fileName = '';
    if (props.answer.imageLocations.length > 0) {
      fileName = props.answer.imageLocations[0];
    } else {
      return;
    }

    Util.minioClient.getObject(Util.CONSTANTS.MINIO_BUCKET, fileName, (err: any, dataStream: any) => {
      if (err) {
        console.log(err);
        return;
      }
      setFileData(dataStream.url);
    });
  }, [props.answer.imageLocations]);

  const handleShareClick = () => {
    const url = `${Util.CONSTANTS.CLIENT_URL}/answers/${props.answer._id}`;
    navigator.clipboard.writeText(url);
    setShowShareAlert(true);
  };

  const handleUpVote = async () => {
    const url = `${Util.CONSTANTS.SERVER_URL}/votes/update`;
    const payload = {
      qaId: props.answer._id,
      up: true,
      q: false,
    };

    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setNetCnt(data.newCnt);
  };

  const handleDownVote = async () => {
    const url = `${Util.CONSTANTS.SERVER_URL}/votes/update`;
    const payload = {
      qaId: props.answer._id,
      up: false,
      q: false,
    };

    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setNetCnt(data.newCnt);
  };

  const handleEdit = () => {
    navigate(`/answers/${props.answer._id}/edit`);
  };

  const isOwner = authCtx.getStoredValue().userName === props.answer.user.userName;

  return (
    <div className="cl-AnswerCard">
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
              <Typography>{netCnt}</Typography>
            </div>
            <Tooltip title="Down vote">
              <IconButton onClick={handleDownVote}>
                <ChangeHistoryIcon className="down-icon" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="right-pane">
          <div>
            <Typography variant="body1">{parse(props.answer.details)}</Typography>
          </div>
          {fileData && <Divider />}
          <div className="imageContainer" onClick={handleInageModalOpen}>
            {fileData && <img src={fileData} className="image" />}
          </div>
        </div>
      </Stack>
      <div className="bottom-pane">
        <Typography variant="body2" className="author">
          answered by <span className="user-name">{props.answer.user.userName}</span>
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
          <IconButton className="delete" disabled={!isOwner}>
            <DeleteIcon fontSize="small"></DeleteIcon>
          </IconButton>
        </Tooltip>
      </div>
      {fileData && showImageModal && (
        <Modal open={showImageModal} onClose={handleInageModalClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              bgcolor: 'background.paper',
              border: '2px solid #000',
            }}
          >
            <img src={fileData} style={{ width: '100%', height: 'auto' }} />
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default AnswerCard;
