import { useEffect, useState } from 'react';

import parse from 'html-react-parser';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
  }, []);

  return (
    <Card variant="outlined" className="cl-QuestionCard">
      <CardContent className="content">
        <Typography variant="body1" color="text.primary" className="details">
          {parse(props.question.details)}
        </Typography>
        {fileData && (
          <div>
            <img src={fileData} />
          </div>
        )}
        <Stack className="tags" direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
          {props.question.tags.map((tag) => (
            <Chip key={tag._id} variant="outlined" size="small" label={tag.name} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
