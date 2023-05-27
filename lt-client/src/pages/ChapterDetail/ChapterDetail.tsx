import { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Question } from '../../types';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import AuthContext from '../../store/auth';
import { Typography, Button } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import SortOptions from '../../components/SortOptions/SortOptions';
import { Tag } from '../../types';

import './_index.scss';

const ChapterDetail = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const navigate = useNavigate();
  const { chapterId } = useParams();

  const { isLoggedIn } = useContext(AuthContext);

  const fetchQuestion = useCallback(
    (options: any) => {
      let queryString = '';
      queryString += `sortBy=${options.sortBy}`;
      queryString += `&sortOrder=${options.sortOrder}`;

      const URL = `${Util.CONSTANTS.SERVER_URL}/questions/list?${queryString}`;
      const selectedTagIds = selectedTags.map((tag) => tag._id);
      axios.post(URL, { chapterId, tagIds: selectedTagIds }).then(({ data }) => {
        setQuestions(data);
      });
    },
    [selectedTags, chapterId]
  );

  useEffect(() => {
    fetchQuestion({ sortBy: 'time', sortOrder: 'desc' });
  }, [fetchQuestion]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags/list?chapterId=${chapterId}`;
    axios.get(URL).then((data) => setExistingTags(data.data));
  }, [chapterId]);

  const handleAskQuestion = () => {
    navigate(`/chapters/${chapterId}/ask`);
  };

  const handleQuestionDelete = (_id: string) => {
    setQuestions((prev) => {
      const fq = prev.filter((q) => q._id !== _id);
      return fq;
    });
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
        <div className="ask-btn">
          <Button variant="outlined" disabled={!isLoggedIn} onClick={handleAskQuestion}>
            Ask Question
          </Button>
        </div>
      </div>
      <div>
        <SortOptions fetchSortedData={fetchQuestion} />
      </div>
      {questions.map((question) => (
        <QuestionCard
          key={question._id}
          question={question}
          qdClickable={true}
          handleQuestionDelete={handleQuestionDelete}
        />
      ))}
    </div>
  );
};

export default ChapterDetail;
