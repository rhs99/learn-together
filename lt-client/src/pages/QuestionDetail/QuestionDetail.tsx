import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Question, Answer } from '../../types';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import ReactQuill from 'react-quill';
import AnswerCard from '../../components/AnswerCard/AnswerCard';
import { Button } from '@mui/material';
import { PassThrough } from 'stream';
import AuthContext from '../../store/auth';
import Util from '../../utils';

import './_index.scss';

const QuestionDetail = () => {
  const [question, setQuestion] = useState<Question>();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [description, setDescription] = useState('');
  const [imageLocations, setImageLocations] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(true);
  const editorRef = useRef<ReactQuill>(null);
  const { questionId } = useParams();

  const { isLoggedIn, getToken } = useContext(AuthContext);

  const [inputRef, setInputRef] = useState<{ value: '' }>();

  const fetchAnswers = useCallback(async () => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/answers/list?questionId=${questionId}`;
    return axios.get(URL).then(({ data }) => data);
  }, [questionId]);

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/questions?questionId=${questionId}`;
    axios.get(URL).then(({ data }) => {
      setQuestion(data);
    });
    fetchAnswers().then((data) => setAnswers(data));
  }, [questionId, fetchAnswers]);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (editorRef.current?.getEditor().getText().trim().length !== 0 || imageLocations.length !== 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    console.log(file);
    const metadata = {
      'Content-type': 'image',
    };
    const reader = new FileReader();
    reader.onload = function (e: any) {
      const buffer = e.target.result;
      const stream = new PassThrough();
      stream.end(Buffer.from(buffer));

      const uniqueFileName = questionId + '-' + file.name;

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
    if (editorRef.current?.getEditor().getText().trim().length !== 0 || imageLocations.length !== 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
      return;
    }

    const answer: Partial<Answer> = {
      details: description,
      question: questionId,
      imageLocations: imageLocations,
    };
    const URL = `${Util.CONSTANTS.SERVER_URL}/answers/create`;

    await axios.post(URL, answer, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    fetchAnswers().then((data) => setAnswers(data));
    if (inputRef) {
      inputRef.value = '';
    }

    setDescription('');
    setImageLocations([]);
    setDisabled(true);
    editorRef.current?.blur();
  };

  if (!question) {
    return null;
  }

  return (
    <div className="cl-QuestionDetail">
      <QuestionCard question={question} qdClickable={false} />
      {isLoggedIn && (
        <div>
          <div className="aHeader">
            <h3>Write Your Answer</h3>
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
      )}
      {answers.map((answer) => (
        <AnswerCard key={answer._id} answer={answer} />
      ))}
    </div>
  );
};

export default QuestionDetail;
