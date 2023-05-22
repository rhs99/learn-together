import { useNavigate } from 'react-router-dom';
import { useState, useRef, useContext } from 'react';
import { Button } from '@mui/material';
import ReactQuill from 'react-quill';
import { PassThrough } from 'stream';
import { Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';

import './_index.scss';

type AnswerInputProps = {
  answer: Partial<Answer>;
  fetchAnswer?: () => Promise<void>;
};

const AnswerInput = (props: AnswerInputProps) => {
  const [description, setDescription] = useState(props.answer.details || '');
  const [imageLocations, setImageLocations] = useState<string[]>(props.answer.imageLocations || []);
  const [disabled, setDisabled] = useState(true);
  const editorRef = useRef<ReactQuill>(null);
  const [inputRef, setInputRef] = useState<{ value: '' }>();

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (editorRef.current?.getEditor().getText().trim().length !== 0 || imageLocations.length !== 0) {
      if (disabled) {
        setDisabled(false);
      }
    } else {
      if (!disabled) {
        setDisabled(true);
      }
    }
  };

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
          setDisabled(false);
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePostAnswer = async () => {
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
        setImageLocations([]);
        setDescription('');
        if (inputRef) {
          inputRef.value = '';
        }
        setDisabled(true);
      });
    }
  };

  return (
    <div className="cl-AnswerInput">
      <div className="aHeader">
        <h3>Your Answer</h3>
      </div>
      <ReactQuill
        ref={editorRef}
        className="editor"
        theme="snow"
        value={description}
        onChange={handleDescriptionChange}
      />
      <div className="file-upload">
        <input type="file" ref={(ref: any) => setInputRef(ref)} onChange={handleFileUpload} />
      </div>
      <div className="btn-container">
        <Button variant="outlined" disabled={disabled} onClick={handlePostAnswer}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default AnswerInput;
