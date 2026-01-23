import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, useCallback } from 'react';
import Quill from 'quill';
import Util from '../../utils';
import axios from 'axios';
import { Question } from '../../types';
import AuthContext from '../../store/auth';
import { Tag } from '../../types';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import TagInput from '../TagInput/TagInput';
import FileUploader from '../FileUploader/FileUploader';
import useFileUploader from '../../hooks/file-uploader';
import useAlert from '../../hooks/use-alert';

import { Box, Button, Flex, Spinner, Text } from '@optiaxiom/react';

import './_index.scss';

type QuestionInputProps = {
  chapterId: string;
  question?: Question;
};

const QuestionInput = (props: QuestionInputProps) => {
  const [tags, setTags] = useState<Tag[]>(
    props.question ? props.question.tags.map((tag) => ({ _id: tag._id, name: tag.name })) : []
  );
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [editor, setEditor] = useState<Quill | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const onAlert = useAlert();

  const { handleFileChange, handleUpload } = useFileUploader();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags?chapterId=${props.chapterId}`;
    axios.get(URL).then((data) => setExistingTags(data.data));
  }, [props.chapterId]);

  const handleSave = async () => {
    const description = editor?.getContents();
    const text = editor?.getText() || '';
    if (text.trim().length === 0 || tags.length === 0) {
      onAlert('Question description and tags cannot be empty!', 'danger');
      return;
    }

    setIsLoading(true);

    const imageLocations = await handleUpload();

    const question = {
      _id: props.question?._id || '',
      details: description,
      chapter: props.chapterId,
      tags: [],
      imageLocations: imageLocations,
    };

    const newTags: Tag[] = [];

    tags.forEach((tag) => {
      if (tag._id.length === 0) {
        newTags.push({ _id: '', name: tag.name, chapter: props.chapterId });
      } else {
        (question.tags as Tag[]).push({ _id: tag._id, name: tag.name });
      }
    });

    const tagURL = `${Util.CONSTANTS.SERVER_URL}/tags`;
    const tagPromises = newTags.map((tag) => {
      return axios.post(tagURL, { name: tag.name, chapter: tag.chapter });
    });

    const allData = await Promise.all(tagPromises);

    allData.forEach(({ data }) => {
      (question.tags as Tag[]).push({ _id: data._id, name: data.name });
    });

    const questionURL = `${Util.CONSTANTS.SERVER_URL}/questions`;

    await axios.post(questionURL, question, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });

    setIsLoading(false);
    navigate(`/chapters/${props.chapterId}`);
  };

  const handleClose = () => {
    navigate(`/chapters/${props.chapterId}`);
  };

  const onEditorReady = useCallback(
    (editor: Quill) => {
      setEditor(editor);
      if (props.question?.details) {
        editor.setContents(props.question?.details);
      }
    },
    [props.question?.details]
  );

  const onTagsChange = (tags: Tag[]) => {
    setTags(tags);
  };

  if (!authCtx.isLoggedIn) {
    return null;
  }

  return (
    <Box className="cl-QuestionInput">
      {isLoading && <Spinner />}

      <Text fontSize="xl" fontWeight="600" mb="8">
        Write Question Description
      </Text>
      <QuillTextEditor onEditorReady={onEditorReady} />

      <Flex flexDirection="column" gap="8" mt="16" mb="16">
        <Text fontWeight="500" fontSize="md">
          Add Relevant Tags
        </Text>
        <TagInput
          suggestions={existingTags.map((tag) => ({ _id: tag._id, name: tag.name }))}
          onTagsChange={onTagsChange}
          initialTags={tags}
        />
      </Flex>
      <FileUploader handleFileChange={handleFileChange} className="file-upload" />
      <Flex className="btn-container" flexDirection="row" justifyContent="flex-end" gap="8" mt="16">
        <Button onClick={handleClose} appearance="danger">
          Close
        </Button>
        <Button onClick={handleSave} appearance="primary">
          Save
        </Button>
      </Flex>
    </Box>
  );
};

export default QuestionInput;
