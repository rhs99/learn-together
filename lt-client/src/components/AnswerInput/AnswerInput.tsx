import { useNavigate } from 'react-router-dom';
import { useState, useContext, useCallback } from 'react';
import { Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';
import Quill, { Delta } from 'quill';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import FileUploader from '../FileUploader/FileUploader';
import useFileUploader from '../../hooks/file-uploader';
import useAlert from '../../hooks/use-alert';

import { Button, Spinner } from '@optiaxiom/react';

import './_index.scss';

type AnswerInputProps = {
  answer: Partial<Answer>;
  fetchAnswer?: () => Promise<void>;
};

const AnswerInput = (props: AnswerInputProps) => {
  const [editor, setEditor] = useState<Quill>();
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const onAlert = useAlert();

  const { handleFileChange, handleUpload } = useFileUploader();

  const handlePostAnswer = async () => {
    const description = editor?.getContents();
    const text = editor?.getText() || '';

    const imageLocations = await handleUpload();
    if (text.trim().length === 0 && (!imageLocations || imageLocations.length === 0)) {
      onAlert('Answer description and files both cannot be empty!', 'danger');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

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
      setIsLoading(false);
      navigate(-1);
    } else if (props.fetchAnswer) {
      props.fetchAnswer().then(() => {
        if (editor) editor.setContents(new Delta());
      });
    }
    setIsLoading(false);
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
      {isLoading && (
        <div className="spinner-overlay">
          <Spinner />
        </div>
      )}
      <div className="lt-AnswerInput-header">
        <h3>Your Answer</h3>
        <p className="subtitle">Share your knowledge and help others learn</p>
      </div>
      <div className="editor-container">
        <QuillTextEditor onEditorReady={onEditorReady} />
      </div>
      <div className="file-section">
        <h4>Add Supporting Images</h4>
        <FileUploader handleFileChange={handleFileChange} multiple={true} className="lt-AnswerInput-file-upload" />
      </div>
      <div className="button-container">
        <Button onClick={() => navigate(-1)} className="cancel-button">
          Cancel
        </Button>
        <Button onClick={handlePostAnswer} className="save-button">
          Submit Answer
        </Button>
      </div>
    </div>
  );
};

export default AnswerInput;
