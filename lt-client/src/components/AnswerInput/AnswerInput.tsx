import { useNavigate } from 'react-router-dom';
import { useState, useContext, useCallback, ChangeEvent } from 'react';
import { Button } from '@mui/material';
import { Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';
import Quill, { DeltaStatic } from 'quill';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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

  const setImageLocations = (image: string) => {
    _setImageLocations((prev) => {
      return [...prev, image];
    });
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    props.answer.imageLocations?.forEach((image) => {
      Util.deleteFile(image);
    });
    if (event.target.files) {
      await Util.uploadFile(event.target.files[0], setImageLocations);
      if (event.target.files.length > 1) {
        await Util.uploadFile(event.target.files[1], setImageLocations);
      }
    }
    setIsUploading(false);
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
    <div className="cl-AnswerInput">
      {showAlert && (
        <Stack sx={{ width: '50%', margin: '10px auto' }}>
          <Alert
            severity="error"
            onClose={() => {
              setShowAlert(false);
            }}
          >
            <AlertTitle>Error</AlertTitle>
            Answer <strong>description and image</strong> both cannot be empty!
          </Alert>
        </Stack>
      )}
      {isUploading && (
        <Box sx={{ position: 'fixed', top: '50%', left: '50%' }}>
          <CircularProgress color="inherit" />
        </Box>
      )}
      <div className="aHeader">
        <h3>Your Answer</h3>
      </div>
      <QuillTextEditor onEditorReady={onEditorReady} />
      <input
        className="file-input"
        type="file"
        accept="image/*"
        multiple
        ref={(ref) => setInputRef(ref)}
        onChange={handleFileUpload}
      />
      <div className="btn-container">
        <Button variant="outlined" onClick={handlePostAnswer}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default AnswerInput;
