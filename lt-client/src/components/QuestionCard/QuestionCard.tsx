import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import parse from 'html-react-parser';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Divider, Chip, Modal, Box, IconButton, Tooltip } from '@mui/material';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
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

  const qdClassName = props.qdClickable ? 'detailsClickable' : '';
  const qdOnClick = props.qdClickable ? handleQuestionClick : undefined;

  return (
    <div className="cl-QuestionCard">
      <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem className="divider" />}>
        <div className="left-pane">
          <div className="UD-container">
            <Tooltip title="Up vote">
              <IconButton>
                <ChangeHistoryIcon />
              </IconButton>
            </Tooltip>
            <div className="net-cnt">
              <Typography>0</Typography>
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
