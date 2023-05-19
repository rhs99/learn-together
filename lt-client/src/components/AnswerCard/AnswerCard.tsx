import { useEffect, useState } from 'react';

import parse from 'html-react-parser';
import { Typography, Modal, Box } from '@mui/material';
import { Answer } from '../../types';
import Util from '../../utils';

import './_index.scss';

type AnswerCardProps = {
  answer: Answer;
};

const AnswerCard = (props: AnswerCardProps) => {
  const [fileData, setFileData] = useState(null);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

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

  return (
    <div className="cl-AnswerCard">
      <div className="aContent">
        <div className="aDetails">
          <Typography variant="body1" color="text.primary">
            {parse(props.answer.details)}
          </Typography>
        </div>
        <div className="aImageContainer" onClick={handleInageModalOpen}>
          {fileData && <img src={fileData} className="qImage" />}
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
    </div>
  );
};

export default AnswerCard;
