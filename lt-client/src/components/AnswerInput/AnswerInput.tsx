import { useNavigate } from 'react-router-dom';
import { useState, useContext, useCallback } from 'react';
import { Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';
import Quill from 'quill';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import Alert from '../../design-library/Alert/Alert';
import Button from '../../design-library/Button/Button';
import FileUploader from '../FileUploader/FileUploader';
import useFileUploader from '../../hooks/file-uploader';
import Spinner from '../../design-library/Spinner/Spinner';

import './_index.scss';

type AnswerInputProps = {
  answer: Partial<Answer>;
  fetchAnswer?: () => Promise<void>;
};

const AnswerInput = (props: AnswerInputProps) => {
  const [editor, setEditor] = useState<Quill>();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const { handleFileChange, handleUpload } = useFileUploader();

  const handlePostAnswer = async () => {
    const description = editor?.getContents();
    const text = editor?.getText() || '';

    const imageLocations = await handleUpload();
    if (text.trim().length === 0 && (!imageLocations || imageLocations.length === 0)) {
      setShowAlert(true);
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
        if (editor) editor.setContents({} as any);
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
      {showAlert && (
        <Alert
          isShown={showAlert}
          handleClose={() => setShowAlert(false)}
          type="error"
          message="Answer description and files both cannot be empty!"
        />
      )}
      {isLoading && <Spinner isLoading={isLoading} />}
      <div className="lt-AnswerInput-header">
        <h3>Your Answer</h3>
      </div>
      <QuillTextEditor onEditorReady={onEditorReady} />
      <FileUploader handleFileChange={handleFileChange} multiple={true} className="lt-AnswerInput-file-upload" />
      <Button onClick={handlePostAnswer} variant="success">
        Save
      </Button>
    </div>
  );
};

export default AnswerInput;
