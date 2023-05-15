import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Util from '../../utils';
import axios from 'axios';
import { Question } from '../../types';
import './_index.scss';
import { PassThrough } from 'stream';

type QuestionInputProps = {
  chapterId: string;
};

const QuestionInput = (props: QuestionInputProps) => {
  const [value, setValue] = useState('');
  const [tags, setTags] = useState('');
  const [imageLocations, setImageLocations] = useState<string[]>([]);

  const navigate = useNavigate();

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

      const uniqueFileName = props.chapterId + '-' + file.name;

      Util.minioClient.putObject(
        Util.CONSTANTS.MINIO_BUCKET,
        uniqueFileName,
        stream,
        file.size,
        metadata,
        function (err: any, etag: any) {
          if (err) {
            return console.log(err);
          }
          setImageLocations((prevState) => [uniqueFileName, ...prevState]);
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = async () => {
    const allTags = tags.trim().split(/\s+/);
    const tagURL = `${Util.CONSTANTS.SERVER_URL}/tags/create`;

    const tagPromises = allTags.map((tag) => {
      return axios.post(tagURL, {
        name: tag,
        chapter: props.chapterId,
      });
    });

    const question: Partial<Question> = {
      details: value,
      chapter: props.chapterId,
      tags: [],
      imageLocations: imageLocations,
    };

    const allData = await Promise.all(tagPromises);
    allData.forEach(({ data }) => {
      question.tags?.push(data._id);
    });

    const questionURL = `${Util.CONSTANTS.SERVER_URL}/questions/create`;

    await axios.post(questionURL, question);

    navigate(`/chapters/${props.chapterId}`);
  };

  return (
    <div className="cl-TextEditor">
      <h3>Write Question Description</h3>
      <ReactQuill className="editor" theme="snow" value={value} onChange={setValue} />
      <h4>Add relevant tags</h4>
      <div className="tag-box">
        <input className="input-box" onChange={(e) => setTags(e.target.value)} />
      </div>
      <input type="file" onChange={handleFileUpload} />
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default QuestionInput;
