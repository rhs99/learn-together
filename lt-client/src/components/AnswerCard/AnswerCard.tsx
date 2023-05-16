import { useEffect, useState } from 'react';

import parse from 'html-react-parser';
import Typography from '@mui/material/Typography';
import { Answer } from '../../types';
import Util from '../../utils';

import './_index.scss';

type AnswerCardProps = {
  answer: Answer;
};

const AnswerCard = (props: AnswerCardProps) => {
  const [fileData, setFileData] = useState(null);

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
        <div className="aImageContainer">{fileData && <img src={fileData} className="qImage" />}</div>
      </div>
    </div>
  );
};

export default AnswerCard;
