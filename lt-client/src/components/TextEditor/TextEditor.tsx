import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Util from '../../utils';
import axios from 'axios';
import { Question } from '../../types';
import './_index.scss';

type TextEditorProps = {
  chapterId: string;
};

const TextEditor = (props: TextEditorProps) => {
  const [value, setValue] = useState('');
  const [tags, setTags] = useState('');

  const navigate = useNavigate();

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
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default TextEditor;
