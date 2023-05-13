import parse from 'html-react-parser';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Divider, Chip } from '@mui/material';

import { Question } from '../../types';

import './_index.scss';

type QuestionCardProps = {
  question: Question;
};

const QuestionCard = (props: QuestionCardProps) => {
  return (
    <Card variant="outlined" className="cl-QuestionCard">
      <CardContent className="content">
        <Typography variant="body1" color="text.primary" className="details">
          {parse(props.question.details)}
        </Typography>
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
