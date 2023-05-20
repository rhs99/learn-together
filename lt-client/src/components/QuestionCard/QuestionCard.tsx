import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import parse from 'html-react-parser';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Divider, Chip, Modal, Box, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import { Question } from '../../types';
import Util from '../../utils';

import './_index.scss';

type QuestionCardProps = {
  question: Question;
  qdClickable: boolean;
};

const QuestionCard = (props: QuestionCardProps) => {
  const [fileData, setFileData] = useState(null);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [showShareAlert, setShowShareAlert] = useState(false);

  const navigate = useNavigate();

  const handleInageModalOpen = () => {
    setShowImageModal(true);
  };

  const handleInageModalClose = () => {
    setShowImageModal(false);
  };

  useEffect(() => {
    let fileName = '';
    if (props.question.imageLocations.length > 0) {
      fileName = props.question.imageLocations[0];
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
  }, [props.question.imageLocations]);

  const handleQuestionClick = () => {
    navigate(`/questions/${props.question._id}`);
  };

  const handleShareClick = () => {
    const url = `${Util.CONSTANTS.CLIENT_URL}/questions/${props.question._id}`;
    navigator.clipboard.writeText(url);
    setShowShareAlert(true);
  };

  const qdClassName = props.qdClickable ? 'detailsClickable' : '';
  const qdOnClick = props.qdClickable ? handleQuestionClick : undefined;

  return (
    <div className="cl-QuestionCard">
      <Snackbar open={showShareAlert} autoHideDuration={1000} onClose={() => setShowShareAlert(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
      <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <div className="left-pane">
          <div className="UD-container">
            <Tooltip title="Up vote">
              <IconButton>
                <ChangeHistoryIcon />
              </IconButton>
            </Tooltip>
            <div className="net-cnt">
              <Typography>{props.question.upVote - props.question.downVote}</Typography>
            </div>
            <Tooltip title="Down vote">
              <IconButton>
                <ChangeHistoryIcon className="down-icon" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="right-pane">
          <div className={qdClassName} onClick={qdOnClick}>
            <Typography variant="body1">{parse(props.question.details)}</Typography>
          </div>
          {fileData && <Divider />}
          <div className="imageContainer" onClick={handleInageModalOpen}>
            {fileData && <img src={fileData} className="image" />}
          </div>
          {props.question.tags.length > 0 && <Divider />}
          <div className="tags">
            <Stack
              direction="row"
              spacing={2}
              divider={<Divider orientation="vertical" flexItem className="divider" />}
            >
              {props.question.tags.map((tag) => (
                <Chip key={tag._id} variant="outlined" size="small" label={tag.name} className="tag" />
              ))}
            </Stack>
          </div>
        </div>
      </Stack>
      <div className="bottom-pane">
        <Typography variant="body2" className="author">
          Asked by <span className="user-name">{props.question.user.userName}</span>
        </Typography>
        <Tooltip title="share">
          <IconButton className="share" onClick={handleShareClick}>
            <ShareIcon fontSize="small"></ShareIcon>
          </IconButton>
        </Tooltip>
        <Tooltip title="edit">
          <IconButton className="edit">
            <EditIcon fontSize="small"></EditIcon>
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

export default QuestionCard;
