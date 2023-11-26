import { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Question, Breadcrumb } from '../../types';
import AuthContext from '../../store/auth';
import { Typography } from '@mui/material';
import SortOptions from '../../components/SortOptions/SortOptions';
import { Tag, CustomTag } from '../../types';
import QACard from '../../components/QACard/QACard';
import Pagination from '@mui/material/Pagination';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import TagInput from '../../components/TagInput/TagInput';

import Button from '../../design-library/Button';

import './_index.scss';

const ChapterDetail = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<CustomTag[]>([]);
  const [sortBy, setSortBy] = useState<string>('time');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [paginationInfo, setPaginationInfo] = useState({ currPage: 1, totalPage: 1 });
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const navigate = useNavigate();
  const { chapterId } = useParams();

  const { isLoggedIn } = useContext(AuthContext);

  const fetchQuestion = useCallback(() => {
    let queryString = '';
    queryString += `sortBy=${sortBy}`;
    queryString += `&sortOrder=${sortOrder}`;
    queryString += `&pageNumber=${paginationInfo.currPage}`;

    const URL = `${Util.CONSTANTS.SERVER_URL}/questions/search?${queryString}`;
    const selectedTagIds = selectedTags.filter((tag) => tag.id.length > 0).map((tag) => tag.id);
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
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags?chapterId=${chapterId}`;
    axios.get(URL).then((data) => setExistingTags(data.data));
  }, [chapterId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/chapters/${chapterId}/breadcrumb`;
    axios.get(URL).then(({ data }) => {
      setBreadcrumbs(data);
    });
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

  const handleTagDelete = (i: number) => {
    setSelectedTags(selectedTags.filter((tag, index) => index !== i));
  };

  const handleTagAddition = (tag: CustomTag) => {
    if (tag.id === tag.text) {
      return;
    }
    setSelectedTags([...selectedTags, tag]);
  };

  const isEmpty = questions.length === 0;

  return (
    <div className="cl-ChapterDetail">
      <div className="heading">
        {breadcrumbs.length > 0 && (
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs.slice(0, -1).map((breadcrumb) => {
              return (
                <Link key={breadcrumb.name} href={breadcrumb.url} underline="hover">
                  {breadcrumb.name}
                </Link>
              );
            })}
            {<Typography>{breadcrumbs[breadcrumbs.length - 1].name}</Typography>}
          </Breadcrumbs>
        )}
        <div className="filter">
          <TagInput
            tags={selectedTags}
            suggestions={existingTags.map((tag) => ({ id: tag._id, text: tag.name }))}
            handleDelete={handleTagDelete}
            handleAddition={handleTagAddition}
            placeholder="Filter by tags"
          />
        </div>
        <Button disabled={!isLoggedIn} onClick={handleAskQuestion} className="ask-btn">
          Ask Question
        </Button>
      </div>

      <div className="sort-options">
        {!isEmpty && (
          <SortOptions
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSortOptionsChange={handleSortOptionsChange}
            fetchSortedData={fetchQuestion}
          />
        )}
      </div>

      {isEmpty && (
        <div className="empty">
          <Typography variant="h3" color="gray">
            No Questions
          </Typography>
        </div>
      )}

      <div className='qContainer'>
      {questions.map((question) => (
        <QACard
          key={question._id}
          item={question}
          clickableDetails={true}
          isQuestion={true}
          handleItemDelete={handleQuestionDelete}
        />
      ))}
      </div>

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
