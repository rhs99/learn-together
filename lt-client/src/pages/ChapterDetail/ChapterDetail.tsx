import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Question } from '../../types';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import AuthContext from '../../store/auth';
import { Typography, Button } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { Tag } from '../../types';

import './_index.scss';

const ChapterDetail = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const navigate = useNavigate();
  const { chapterId } = useParams();

  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/questions/list`;
    const selectedTagIds = selectedTags.map((tag) => tag._id);
    axios.post(URL, { chapterId, tagIds: selectedTagIds }).then(({ data }) => {
      setQuestions(data);
    });
  }, [chapterId, selectedTags]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags/list?chapterId=${chapterId}`;
    axios.get(URL).then((data) => setExistingTags(data.data));
  }, [chapterId]);

  const handleAskQuestion = () => {
    navigate(`/chapters/${chapterId}/ask`);
  };

  return (
    <div className="cl-ChapterDetail">
      <div className="heading">
        <Typography variant="h6">All Questions</Typography>
        <Autocomplete
          className="filter"
          multiple
          id="tags-standard"
          onChange={(event: any, selection: Tag[]) => {
            setSelectedTags(selection);
          }}
          options={existingTags}
          getOptionLabel={(option) => option.name}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Filter By Tags" placeholder="Select Tags" />
          )}
        />
        {isLoggedIn && (
          <div className="ask-btn">
            <Button variant="outlined" onClick={handleAskQuestion}>
              Ask Question
            </Button>
          </div>
        )}
      </div>
      {questions.map((question) => (
        <QuestionCard key={question._id} question={question} qdClickable={true} />
      ))}
    </div>
  );
};

export default ChapterDetail;
