import { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import { Button, Box, Pagination, Text, Heading, Flex } from '@optiaxiom/react';
import Util from '../../utils';
import { Question, Breadcrumb } from '../../types';
import AuthContext from '../../store/auth';
import SortOptions from '../../components/SortOptions/SortOptions';
import { Tag } from '../../types';
import QACard from '../../components/QACard/QACard';
import TagInput from '../../components/TagInput/TagInput';
import useAlert from '../../hooks/use-alert';
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

  const onAlert = useAlert();

  const navigate = useNavigate();
  const { chapterId } = useParams();

  const { isLoggedIn, getStoredValue } = useContext(AuthContext);
  const token = getStoredValue().token;

  const fetchQuestion = useCallback(() => {
    setIsLoading(true);
    const selectedTagIds = selectedTags.filter((tag) => tag._id.length > 0).map((tag) => tag._id);

    const params: Record<string, string | number | undefined> = {
      chapterId,
      sortBy,
      sortOrder,
      filterBy,
      pageNumber: paginationInfo.currPage,
      pageSize: PAGE_SIZE,
    };

    if (selectedTagIds.length > 0) {
      params.tagIds = selectedTagIds.join(',');
    }

    const URL = `${Util.CONSTANTS.SERVER_URL}/questions`;

    const config: AxiosRequestConfig = {
      params,
    };

    if (isLoggedIn) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    axios
      .get(URL, config)
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
        onAlert('Something went wrong!', 'danger');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedTags, chapterId, sortBy, sortOrder, filterBy, token, paginationInfo.currPage, isLoggedIn, onAlert]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags?chapterId=${chapterId}`;
    axios
      .get(URL)
      .then(({ data }) => setExistingTags(data))
      .catch(() => {
        onAlert('Failed to load tags', 'danger');
      });
  }, [chapterId, onAlert]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/chapters/${chapterId}/breadcrumb`;
    axios
      .get(URL)
      .then(({ data }) => {
        setBreadcrumbs(data);
      })
      .catch(() => {
        onAlert('Failed to load breadcrumbs', 'danger');
      });
  }, [chapterId, onAlert]);

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
    <Box w="full" pb="24">
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ base: 'start', md: 'center' }}
        gap="16"
        mb="32"
        p="24"
        bg="bg.default"
        rounded="lg"
        shadow="md"
      >
        <Box>
          {breadcrumbs.length > 1 && (
            <Button onClick={() => navigate(breadcrumbs[breadcrumbs.length - 2].url)} mb="12">
              Back to Chapters
            </Button>
          )}
          <Heading level="1" fontSize="2xl" fontWeight="700" mb="4">
            {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : 'Chapter Detail'}
          </Heading>
          <Text fontSize="sm" color="fg.secondary">
            Explore questions and answers from this chapter
          </Text>
        </Box>
        <Button disabled={!isLoggedIn} onClick={handleAskQuestion}>
          Ask Question
        </Button>
      </Box>

      <Box bg="bg.default" p="24" rounded="xl" shadow="md">
        <Flex flexDirection={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="16" mb="24">
          <Box flex="1">
            <TagInput
              suggestions={existingTags.map((tag) => ({ _id: tag._id, name: tag.name }))}
              onTagsChange={onTagsChange}
              placeholder="Filter by tags..."
            />
          </Box>

          <Flex flexDirection="row" gap="12">
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
          </Flex>
        </Flex>

        {!isLoading && isEmpty && (
          <Box textAlign="center" py="48" bg="bg.default.hovered" rounded="md">
            <Heading level="3" fontSize="lg" mb="8">
              No Questions Found
            </Heading>
            <Text color="fg.secondary">Be the first to ask a question in this chapter!</Text>
          </Box>
        )}

        {isLoading && (
          <Box textAlign="center" py="48">
            <Text>Loading questions...</Text>
          </Box>
        )}
        {!isLoading && (
          <Flex flexDirection="column" gap="16">
            {questions.map((question) => (
              <QACard
                key={question._id}
                item={question}
                clickableDetails={true}
                isQuestion={true}
                handleItemDelete={handleQuestionDelete}
              />
            ))}
          </Flex>
        )}

        {!isLoading && paginationInfo.totalPage > 1 && (
          <Flex flexDirection="row" justifyContent="center" mt="24">
            <Pagination
              total={paginationInfo.totalPage}
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
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default ChapterDetail;
