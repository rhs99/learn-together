import { useNavigate } from 'react-router-dom';
import { useState, useContext, useCallback, ChangeEvent } from 'react';
import { Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';
import Quill, { DeltaStatic } from 'quill';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import Alert from '../../design-library/Alert/Alert';
import Button from '../../design-library/Button/Button';
import FileUploader from '../FileUploader/FileUploader';

import './_index.scss';

type AnswerInputProps = {
  answer: Partial<Answer>;
  fetchAnswer?: () => Promise<void>;
};

const AnswerInput = (props: AnswerInputProps) => {
  const [imageLocations, _setImageLocations] = useState<string[]>([]);
  const [editor, setEditor] = useState<Quill>();
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>();
  const [showAlert, setShowAlert] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const setImageLocations = (images: string[]) => {
    _setImageLocations((prev) => {
      return [...prev, ...images];
    });
  };

  const handlePostAnswer = async () => {
    const description = editor?.getContents();
    const text = editor?.getText() || '';

    if (text.trim().length === 0 && imageLocations.length === 0) {
      setShowAlert(true);
      return;
    }

    const answer: Partial<Answer> = {
      _id: props.answer._id,
      details: description,
      question: props.answer.question,
      imageLocations: imageLocations,
    };
    const URL = `${Util.CONSTANTS.SERVER_URL}/answers`;

    await axios.post(URL, answer, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });

    if (props.answer._id !== '') {
      navigate(-1);
    } else if (props.fetchAnswer) {
      props.fetchAnswer().then(() => {
        if (editor) editor.setContents({} as DeltaStatic);
        _setImageLocations([]);
        if (inputRef) {
          inputRef.value = '';
        }
      });
    }
  };

  const onEditorReady = useCallback(
    (editor: Quill) => {
      setEditor(editor);
      if (props.answer.details) {
        editor.setContents(props.answer.details);
      }
    },
    [props.answer?.details]
  );

  return (
    <div className="lt-AnswerInput">
      {showAlert && <Alert type="error" message="Answer description and files both cannot be empty!" />}
      {isUploading && <p>Loading...</p>}
      <div className="lt-AnswerInput-header">
        <h3>Your Answer</h3>
      </div>
      <QuillTextEditor onEditorReady={onEditorReady} />
      <FileUploader onUploadComplete={setImageLocations} multiple={true} className="lt-AnswerInput-file-upload" />
      <Button onClick={handlePostAnswer} variant="success">
        Save
      </Button>
    </div>
  );
};

export default AnswerInput;
