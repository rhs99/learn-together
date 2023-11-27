import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, useCallback, ChangeEvent } from 'react';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import Util from '../../utils';
import axios from 'axios';
import { Question } from '../../types';
import AuthContext from '../../store/auth';
import { Tag, CustomTag } from '../../types';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '../../design-library/Button';
import TagInput from '../TagInput/TagInput';

import './_index.scss';

type QuestionInputProps = {
  chapterId: string;
  question?: Question;
};

const QuestionInput = (props: QuestionInputProps) => {
  const [tags, setTags] = useState<CustomTag[]>(
    props.question ? props.question.tags.map((tag) => ({ id: tag._id, text: tag.name })) : []
  );
  const [imageLocations, _setImageLocations] = useState<string[]>([]);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [editor, setEditor] = useState<Quill>();
  const [showAlert, setShowAlert] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags?chapterId=${props.chapterId}`;
    axios.get(URL).then((data) => setExistingTags(data.data));
  }, [props.chapterId]);

  const setImageLocations = (image: string) => {
    _setImageLocations((prev) => {
      return [...prev, image];
    });
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    props.question?.imageLocations?.forEach((image) => {
      Util.deleteFile(image);
    });
    if (event.target.files) {
      const file = event.target.files[0];
      await Util.uploadFile(file, setImageLocations);
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    const description = editor?.getContents();
    const text = editor?.getText() || '';

    if (text.trim().length === 0 || tags.length === 0) {
      setShowAlert(true);
      return;
    }

    const tagURL = `${Util.CONSTANTS.SERVER_URL}/tags`;
    const question = {
      _id: props.question?._id || '',
      details: description,
      chapter: props.chapterId,
      tags: [],
      imageLocations: imageLocations,
    };

    const newTags: Tag[] = [];

    tags.forEach((tag) => {
      if (tag.id.length === 0) {
        newTags.push({ _id: '', name: tag.text, chapter: props.chapterId });
      } else {
        (question.tags as any).push({ _id: tag.id, name: tag.text });
      }
    });

    const tagPromises = newTags.map((tag) => {
      return axios.post(tagURL, { name: tag.name, chapter: tag.chapter });
    });

    const allData = await Promise.all(tagPromises);

    allData.forEach(({ data }) => {
      (question.tags as any).push({ _id: data._id, name: data.name });
    });

    const questionURL = `${Util.CONSTANTS.SERVER_URL}/questions`;

    await axios.post(questionURL, question, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });

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

  const handleTagDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleTagAddition = (tag: CustomTag) => {
    if (tag.id === tag.text) {
      tag.id = '';
    }
    setTags([...tags, tag]);
  };

  if (!authCtx.isLoggedIn) {
    return null;
  }

  return (
    <div className="cl-QuestionInput">
      {showAlert && (
        <Stack sx={{ width: '50%', margin: '10px auto' }}>
          <Alert
            severity="error"
            onClose={() => {
              setShowAlert(false);
            }}
          >
            <AlertTitle>Error</AlertTitle>
            Question <strong>description and tags</strong> cannot be empty!
          </Alert>
        </Stack>
      )}
      <div className="description-heading">
        <h3>Write Question Description</h3>
      </div>
      <QuillTextEditor onEditorReady={onEditorReady} />
      <div>
        <h4>Add Relevant Tags</h4>
      </div>
      <div className="tag-input-container">
        <TagInput
          tags={tags}
          suggestions={existingTags.map((tag) => ({ id: tag._id, text: tag.name }))}
          handleDelete={handleTagDelete}
          handleAddition={handleTagAddition}
        />
      </div>
      <div className="file-upload">
        <input type="file" accept="image/*" multiple={false} onChange={handleFileUpload} />
      </div>
      <div className="btn-container">
        <Button onClick={handleClose} className="close-btn">
          Close
        </Button>
        <Button onClick={handleSave} className="save-btn">
          Save
        </Button>
      </div>
      {isUploading && (
        <Box sx={{ position: 'fixed', top: '50%', left: '50%' }}>
          <CircularProgress color="inherit" />
        </Box>
      )}
    </div>
  );
};

export default QuestionInput;
