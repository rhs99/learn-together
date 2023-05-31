import { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Question } from '../../types';
import AuthContext from '../../store/auth';
import { Typography, Button } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import SortOptions from '../../components/SortOptions/SortOptions';
import { Tag } from '../../types';
import QACard from '../../components/QACard/QACard';
import Pagination from '@mui/material/Pagination';

import './_index.scss';

const ChapterDetail = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [sortBy, setSortBy] = useState<string>('time');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [paginationInfo, setPaginationInfo] = useState({ currPage: 1, totalPage: 1 });

  const navigate = useNavigate();
  const { chapterId } = useParams();

  const { isLoggedIn } = useContext(AuthContext);

  const fetchQuestion = useCallback(() => {
    let queryString = '';
    queryString += `sortBy=${sortBy}`;
    queryString += `&sortOrder=${sortOrder}`;
    queryString += `&pageNumber=${paginationInfo.currPage}`;

    const URL = `${Util.CONSTANTS.SERVER_URL}/questions/list?${queryString}`;
    const selectedTagIds = selectedTags.map((tag) => tag._id);
    axios.post(URL, { chapterId, tagIds: selectedTagIds }).then(({ data }) => {
      setQuestions(data.paginatedResults);
      setPaginationInfo((prev) => {
        return {
          ...prev,
          totalPage: Math.ceil(data.totalCount / 5),
        };
      });
    });
  }, [selectedTags, chapterId, paginationInfo.currPage, sortBy, sortOrder]);

  useEffect(() => {
    fetchQuestion();
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

  const handleSortOptionsChange = (option: string, val: string) => {
    if (option === 'sortBy') {
      setSortBy(val);
    } else if (option === 'sortOrder') {
      setSortOrder(val);
    }
  };

  const isEmpty = questions.length === 0;

  return (
    <div className="cl-ChapterDetail">
      <div className="heading">
        <Typography variant="h6">All Questions</Typography>
        {!isEmpty && (
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
        )}
        <div className="ask-btn">
          <Button variant="contained" disabled={!isLoggedIn} onClick={handleAskQuestion}>
            Ask Question
          </Button>
        </div>
      </div>

      {!isEmpty && (
        <SortOptions
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSortOptionsChange={handleSortOptionsChange}
          fetchSortedData={fetchQuestion}
        />
      )}

      {questions.map((question) => (
        <QACard
          key={question._id}
          item={question}
          clickableDetails={true}
          isQuestion={true}
          handleItemDelete={handleQuestionDelete}
        />
      ))}
      
      {paginationInfo.totalPage > 1 && (
        <Pagination
          count={paginationInfo.totalPage}
          page={paginationInfo.currPage}
          variant="outlined"
          shape="rounded"
          color="primary"
          onChange={(e, page) => {
            setPaginationInfo((prev) => {
              return {
                ...prev,
                currPage: page,
              };
            });
          }}
        />
      )}
    </div>
  );
};

export default ChapterDetail;
