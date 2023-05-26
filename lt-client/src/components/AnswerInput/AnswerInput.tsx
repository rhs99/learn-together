import { useNavigate } from 'react-router-dom';
import { useState, useRef, useContext, useCallback } from 'react';
import { Button } from '@mui/material';
import { PassThrough } from 'stream';
import { Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';
import Quill from 'quill';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import './_index.scss';

type AnswerInputProps = {
  answer: Partial<Answer>;
  fetchAnswer?: () => Promise<void>;
};

const AnswerInput = (props: AnswerInputProps) => {
  const [imageLocations, setImageLocations] = useState<string[]>(props.answer.imageLocations || []);
  const [editor, setEditor] = useState<Quill>();
  const [inputRef, setInputRef] = useState<{ value: '' }>();
  const [showAlert, setShowAlert] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    const metadata = {
      'Content-type': 'image',
    };
    const reader = new FileReader();
    reader.onload = function (e: any) {
      const buffer = e.target.result;
      const stream = new PassThrough();
      stream.end(Buffer.from(buffer));

      const uniqueFileName = props.answer._id + '-' + file.name;

      Util.minioClient.putObject(
        Util.CONSTANTS.MINIO_BUCKET,
        uniqueFileName,
        stream,
        file.size,
        metadata,
        function (err: any) {
          if (err) {
            return console.log(err);
          }
          setImageLocations((prevState) => [uniqueFileName, ...prevState]);
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePostAnswer = async () => {
    const description = editor?.getContents().ops || [];
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
    const URL = `${Util.CONSTANTS.SERVER_URL}/answers/create`;

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
        if (editor) editor.setContents([] as any);
        setImageLocations([]);
        if (inputRef) {
          inputRef.value = '';
        }
      });
    }
  };

  const onEditorReady = useCallback((editor: Quill) => {
    setEditor(editor);
    editor.setContents(props.answer?.details || []);
  }, []);

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
      <div className="aHeader">
        <h3>Your Answer</h3>
      </div>
      <QuillTextEditor onEditorReady={onEditorReady} />
      <input className="file-input" type="file" ref={(ref: any) => setInputRef(ref)} onChange={handleFileUpload} />
      <div className="btn-container">
        <Button variant="outlined" onClick={handlePostAnswer}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default AnswerInput;
