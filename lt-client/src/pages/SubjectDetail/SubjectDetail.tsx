import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Heading, Text } from '@optiaxiom/react';
import Util from '../../utils';
import { Chapter, Breadcrumb } from '../../types';
import Table from '../../design-library/Table/Table';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const SubjectDetail = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const navigate = useNavigate();
  const { subjectId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/chapters?subjectId=${subjectId}`;
    axios.get(URL).then(({ data }) => {
      setChapters(data);
    });
  }, [subjectId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/subjects/${subjectId}/breadcrumb`;
    axios.get(URL).then(({ data }) => {
      setBreadcrumbs(data);
    });
  }, [subjectId]);

  const handleChapterOpen = (id: string) => {
    navigate(`/chapters/${id}`);
  };

  const rowData = useMemo(() => {
    const rows = [{ value: ['Chapter', 'Questions'] }];
    chapters.forEach((chap) => {
      const data = { value: [chap.name, String(chap.questionsCount)], options: { _id: chap._id } };
      rows.push(data);
    });
    return rows;
  }, [chapters]);

  return (
    <Box w="full" mx="auto" px="24" pb="24" style={{ maxWidth: '1200px' }}>
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ base: 'start', md: 'center' }}
        gap="16"
        mb="32"
        p="24"
        bg="bg.default"
        rounded="xl"
        shadow="md"
      >
        <Box>
          {breadcrumbs.length > 0 && (
            <Box mb="12">
              <Breadcrumbs
                items={breadcrumbs.slice(0, -1).map((breadcrumb, index) => ({
                  name: breadcrumb.name,
                  url: index < breadcrumbs.length - 1 ? breadcrumb.url : null,
                }))}
              />
            </Box>
          )}
          <Heading level="1" fontSize="3xl" fontWeight="700" mb="8">
            {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : 'Subject Detail'}
          </Heading>
          <Text fontSize="lg" color="fg.secondary">
            Explore chapters and learning materials for this subject
          </Text>
        </Box>
        <Button onClick={() => navigate(`/classes/${breadcrumbs[0]?.url.split('/').pop()}`)}>Back to Subjects</Button>
      </Box>

      <Box bg="bg.default" p="24" rounded="xl" shadow="md">
        <Box mb="24">
          <Heading level="2" fontSize="2xl" mb="8">
            Available Chapters
          </Heading>
          <Text fontSize="lg" color="fg.secondary">
            Select a chapter to view questions and learning materials
          </Text>
        </Box>
        <Box rounded="lg" style={{ overflow: 'hidden' }}>
          <Table rowData={rowData} onRowSelection={handleChapterOpen} />
        </Box>
      </Box>
    </Box>
  );
};

export default SubjectDetail;
