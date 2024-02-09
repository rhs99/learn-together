import { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Util from '../../utils';
import { Question, Breadcrumb } from '../../types';
import AuthContext from '../../store/auth';
import SortOptions from '../../components/SortOptions/SortOptions';
import { Tag } from '../../types';
import QACard from '../../components/QACard/QACard';
import Pagination from '../../components/Pagination/Pagination';
import Button from '../../design-library/Button/Button';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import TagInput from '../../components/TagInput/TagInput';
import Alert from '../../design-library/Alert/Alert';

import './_index.scss';
import FilterOptions from '../../components/FilterOptions/FilterOptions';

const PAGE_SIZE = 10;

const ChapterDetail = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [sortBy, setSortBy] = useState<string>('time');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [paginationInfo, setPaginationInfo] = useState({ currPage: 1, totalPage: 1 });
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [filterBy, setFilterBy] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<any>(null);

  const navigate = useNavigate();
  const { chapterId } = useParams();

  const { isLoggedIn, getStoredValue } = useContext(AuthContext);
  const token = getStoredValue().token;

  const fetchQuestion = useCallback(() => {
    setIsLoading(true);
    let queryString = '';
    queryString += `sortBy=${sortBy}`;
    queryString += `&sortOrder=${sortOrder}`;
    queryString += `&filterBy=${filterBy}`;
    queryString += `&pageNumber=${paginationInfo.currPage}`;
    queryString += `&pageSize=${PAGE_SIZE}`;

    const URL = `${Util.CONSTANTS.SERVER_URL}/questions/search?${queryString}`;
    const selectedTagIds = selectedTags.filter((tag) => tag._id.length > 0).map((tag) => tag._id);
    const payload = {
      chapterId,
      tagIds: selectedTagIds,
    };

    const header = isLoggedIn
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {};

    axios
      .post(URL, payload, {
        headers: header,
      })
      .then(({ data }) => {
        setQuestions(data.paginatedResults);
        setPaginationInfo((prev) => {
          return {
            ...prev,
            totalPage: Math.ceil(data.totalCount / PAGE_SIZE),
          };
        });
      })
      .catch(() => {
        setAlert({ type: 'error', message: 'Something went wrong!' });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedTags, chapterId, sortBy, sortOrder, filterBy, token, paginationInfo.currPage]);

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

  const handleFilterOptionsChange = (value: string) => {
    setFilterBy(value);
  };

  const onTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags);
  };

  const isEmpty = questions.length === 0;

  return (
    <div className="cl-ChapterDetail">
      {alert && (
        <Alert type={alert.type} message={alert.message} isShown={Boolean(alert)} handleClose={() => setAlert(null)} />
      )}
      <div className="heading">
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            items={breadcrumbs.map((breadcrumb, index) => ({
              name: breadcrumb.name,
              url: index < breadcrumbs.length - 1 ? breadcrumb.url : null,
            }))}
          />
        )}
        <div className="filter">
          <TagInput
            suggestions={existingTags.map((tag) => ({ _id: tag._id, name: tag.name }))}
            onTagsChange={onTagsChange}
            placeholder="Filter by tags..."
          />
        </div>
        <Button disabled={!isLoggedIn} onClick={handleAskQuestion}>
          Ask Question
        </Button>
      </div>

      <div className="sort-options">
        <FilterOptions
          filterBy={filterBy}
          handleFilterOptionsChange={handleFilterOptionsChange}
          fetchSortedData={fetchQuestion}
          disabled={!isLoggedIn}
        />
        <SortOptions
          sortBy={sortBy}
          sortOrder={sortOrder}
          handleSortOptionsChange={handleSortOptionsChange}
          fetchSortedData={fetchQuestion}
        />
      </div>

      {!isLoading && isEmpty && (
        <div className="empty">
          <h1>No Questions</h1>
        </div>
      )}

      {isLoading && <div className="loading">Loading...</div>}

      {!isLoading && (
        <div className="qContainer">
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
      )}

      {!isLoading && paginationInfo.totalPage > 1 && (
        <Pagination
          totalPages={paginationInfo.totalPage}
          page={paginationInfo.currPage}
          onPageChange={(page) => {
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
