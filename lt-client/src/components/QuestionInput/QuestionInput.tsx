import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, useCallback, ChangeEvent } from 'react';
import Quill from 'quill';
import Util from '../../utils';
import axios from 'axios';
import { Question } from '../../types';
import AuthContext from '../../store/auth';
import { Tag } from '../../types';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import Button from '../../design-library/Button/Button';
import Alert from '../../design-library/Alert/Alert';
import TagInput from '../TagInput/TagInput';
import FileUploader from '../FileUploader/FileUploader';
import useFileUploader from '../../hooks/file-uploader';
import Spinner from '../../design-library/Spinner/Spinner';

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
  const [editor, setEditor] = useState<Quill>();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const { handleFileChange, handleUpload } = useFileUploader();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags?chapterId=${props.chapterId}`;
    axios.get(URL).then((data) => setExistingTags(data.data));
  }, [props.chapterId]);

  const handleSave = async () => {
    const description = editor?.getContents();
    const text = editor?.getText() || '';
    if (text.trim().length === 0 || tags.length === 0) {
      setShowAlert(true);
      return;
    }
    setIsLoading(true);
    const imageLocations = await handleUpload();
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
      if (tag._id.length === 0) {
        newTags.push({ _id: '', name: tag.name, chapter: props.chapterId });
      } else {
        (question.tags as Tag[]).push({ _id: tag._id, name: tag.name });
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
    <div className="cl-QuestionInput">
      {showAlert && (
        <Alert
          type="error"
          message="Question description and tags cannot be empty!"
          isShown={showAlert}
          handleClose={() => setShowAlert(false)}
        />
      )}
      {isLoading && <Spinner isLoading={isLoading} />}
      <div className="description-heading">
        <h3>Write Question Description</h3>
      </div>
      <QuillTextEditor onEditorReady={onEditorReady} />
      <div>
        <h4>Add Relevant Tags</h4>
      </div>
      <div className="tag-input-container">
        <TagInput
          suggestions={existingTags.map((tag) => ({ _id: tag._id, name: tag.name }))}
          onTagsChange={onTagsChange}
        />
      </div>
      <FileUploader handleFileChange={handleFileChange} className="file-upload" />
      <div className="btn-container">
        <Button onClick={handleClose} variant="secondary">
          Close
        </Button>
        <Button onClick={handleSave} variant="success">
          Save
        </Button>
      </div>
    </div>
  );
};

export default QuestionInput;
