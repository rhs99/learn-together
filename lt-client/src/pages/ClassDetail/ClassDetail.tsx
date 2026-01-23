import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Heading, Text } from '@optiaxiom/react';
import Util from '../../utils';
import { Subject } from '../../types';
import Table from '../../design-library/Table/Table';

const ClassDetail = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [className, setClassName] = useState();
  const navigate = useNavigate();
  const { classId } = useParams();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/subjects?classId=${classId}`;
    axios.get(URL).then(({ data }) => {
      setSubjects(data);
    });
  }, [classId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/classes/${classId}`;
    axios.get(URL).then(({ data }) => {
      setClassName(data.name);
    });
  }, [classId]);

  const handleSubjectClick = (id: string) => {
    navigate(`/subjects/${id}`);
  };

  const rowData = useMemo(() => {
    const rows = [{ value: ['Subject', 'Chapters'] }];
    subjects.forEach((sub) => {
      const data = { value: [sub.name, String(sub.chapters.length)], options: { _id: sub._id } };
      rows.push(data);
    });
    return rows;
  }, [subjects]);

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
        rounded="lg"
        shadow="md"
      >
        <Box>
          <Heading level="1" fontSize="2xl" fontWeight="700" mb="4">
            {className}
          </Heading>
          <Text fontSize="sm" color="fg.secondary">
            Explore subjects and learning materials for this class
          </Text>
        </Box>
        <Button onClick={() => navigate('/')}>Back to Classes</Button>
      </Box>

      <Box bg="bg.default" p="24" rounded="lg" shadow="md">
        <Box mb="20">
          <Heading level="2" fontSize="xl" fontWeight="700" mb="4">
            Available Subjects
          </Heading>
          <Text fontSize="sm" color="fg.secondary">
            Select a subject to view chapters and learning materials
          </Text>
        </Box>
        <Box rounded="lg" style={{ overflow: 'hidden' }}>
          <Table rowData={rowData} onRowSelection={handleSubjectClick} />
        </Box>
      </Box>
    </Box>
  );
};

export default ClassDetail;
