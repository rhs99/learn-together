import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import parse from 'html-react-parser';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Divider, Chip } from '@mui/material';
import { Question } from '../../types';
import Util from '../../utils';

import './_index.scss';

type QuestionCardProps = {
  question: Question;
};

const QuestionCard = (props: QuestionCardProps) => {
  const [fileData, setFileData] = useState(null);

  const navigate = useNavigate();

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

  return (
    <div className="cl-QuestionCard">
      <div className="qContent">
        <div className="qDetails" onClick={handleQuestionClick}>
          <Typography variant="body1" color="text.primary">
            {parse(props.question.details)}
          </Typography>
        </div>
        <div className="qImageContainer">{fileData && <img src={fileData} className="qImage" />}</div>
        <div className="qTags">
          <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem className="divider" />}>
            {props.question.tags.map((tag) => (
              <Chip key={tag._id} variant="outlined" size="small" label={tag.name} className="tag" />
            ))}
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
