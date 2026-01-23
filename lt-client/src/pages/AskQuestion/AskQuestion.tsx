import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import QuestionInput from '../../components/QuestionInput/QuestionInput';
import Util from '../../utils';
import { Box, Button, Heading, Text } from '@optiaxiom/react';

const AskQuestion = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapterName, setChapterName] = useState<string>('');

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/chapters/${chapterId}/breadcrumb`;
    axios.get(URL).then(({ data }) => {
      if (data.length > 0) {
        setChapterName(data[data.length - 1].name);
      }
    });
  }, [chapterId]);

  return (
    <Box w="full" my="32">
      <Box mb="32" p="24" bg="bg.default" rounded="xl" shadow="md">
        <Button appearance="subtle" onClick={() => navigate(`/chapters/${chapterId}`)} mb="12">
          ← Back to Chapter
        </Button>
        <Heading level="1" fontSize="3xl" fontWeight="700" mb="8">
          Ask a Question
        </Heading>
        <Text fontSize="lg" color="fg.secondary">
          {chapterName ? `Creating a new question in ${chapterName}` : 'Create a new question'}
        </Text>
      </Box>

      <Box bg="bg.default" p="32" rounded="xl" shadow="md">
        <QuestionInput chapterId={chapterId as string} />
      </Box>
    </Box>
  );
};

export default AskQuestion;
