import { useNavigate } from 'react-router-dom';
import { useState, useRef, useContext, useEffect, useReducer } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Util from '../../utils';
import axios from 'axios';
import { Question } from '../../types';
import { PassThrough } from 'stream';
import AuthContext from '../../store/auth';
import { Button } from '@mui/material';
import { Tag } from '../../types';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';

import './_index.scss';

const filter = createFilterOptions<Tag>();

type QuestionInputProps = {
  chapterId: string;
  question?: Question;
};

type QInputState = {
  description: string;
  imageLocations: string[];
  disabled: boolean;
  selectedTags: Tag[];
  text: string;
};

const reducer = (state: QInputState, action: any): QInputState => {
  const getDisbleStatus = (state: QInputState): QInputState => {
    if (state.selectedTags.length > 0 && state.text.trim().length !== 0) {
      return { ...state, disabled: false };
    }
    return { ...state, disabled: true };
  };

  let ns = { ...state };

  if (action.type === 'description') {
    ns.description = action.payload.value;
    ns.text = action.payload.text;
  }
  if (action.type === 'file') {
    ns.imageLocations = [action.payload];
  }
  if (action.type === 'tag') {
    ns.selectedTags = action.payload;
  }
  ns = getDisbleStatus(ns);
  return ns;
};

const QuestionInput = (props: QuestionInputProps) => {
  const init: QInputState = {
    description: props.question?.details || '',
    imageLocations: props.question?.imageLocations || [],
    disabled: props.question ? false : true,
    selectedTags: props.question?.tags || [],
    text: props.question?.details || '',
  };
  const [qInputState, dispatch] = useReducer(reducer, init);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);

  const editorRef = useRef<ReactQuill>(null);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags/list?chapterId=${props.chapterId}`;
    axios.get(URL).then((data) => setExistingTags(data.data));
  }, [props.chapterId]);

  const handleDescriptionChange = (value: string) => {
    const text = editorRef.current?.getEditor().getText();
    dispatch({ type: 'description', payload: { value, text } });
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

      const uniqueFileName = props.chapterId + '-' + file.name;

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
          dispatch({ type: 'file', payload: uniqueFileName });
        }
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = async () => {
    const tagURL = `${Util.CONSTANTS.SERVER_URL}/tags/create`;
    const question = {
      _id: props.question?._id || '',
      details: qInputState.description,
      chapter: props.chapterId,
      tags: [],
      imageLocations: qInputState.imageLocations,
    };

    const newTags: Tag[] = [];

    qInputState.selectedTags.forEach((tag) => {
      if (tag._id.length === 0) {
        newTags.push(tag);
      } else {
        (question.tags as string[]).push(tag._id);
      }
    });

    const tagPromises = newTags.map((tag) => {
      return axios.post(tagURL, { name: tag.name, chapter: tag.chapter });
    });

    const allData = await Promise.all(tagPromises);

    allData.forEach(({ data }) => {
      (question.tags as string[]).push(data._id);
    });

    const questionURL = `${Util.CONSTANTS.SERVER_URL}/questions/create`;

    await axios.post(questionURL, question, {
      headers: {
        Authorization: `Bearer ${authCtx.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    navigate(`/chapters/${props.chapterId}`);
  };

  const handleClose = () => {
    navigate(`/chapters/${props.chapterId}`);
  };

  if (!authCtx.isLoggedIn) {
    return null;
  }

  return (
    <div className="cl-QuestionInput">
      <div className="description-heading">
        <h3>Write Question Description</h3>
      </div>
      <ReactQuill
        ref={editorRef}
        className="editor"
        theme="snow"
        value={qInputState.description}
        onChange={handleDescriptionChange}
      />
      <div className="tag-heading">
        <h4>Add Relevant Tags</h4>
      </div>
      <div className="tag-input-container">
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={(event: any, selection: Tag[]) => {
            dispatch({ type: 'tag', payload: selection });
          }}
          options={existingTags}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some(
              (option) => inputValue.toLocaleLowerCase() === option.name.toLocaleLowerCase()
            );
            if (inputValue !== '' && !isExisting) {
              const newTag = {
                _id: '',
                chapter: props.chapterId,
                name: inputValue,
              };
              filtered.push(newTag);
            }
            return filtered;
          }}
          getOptionLabel={(option) => option.name}
          defaultValue={qInputState.selectedTags}
          renderInput={(params) => <TextField {...params} variant="standard" label="All Tags" placeholder="Add Tags" />}
        />
      </div>
      <div className="file-upload">
        <input type="file" onChange={handleFileUpload} />
      </div>
      <div className="btn-container">
        <Button variant="outlined" onClick={handleClose} color="error" className="close-btn">
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={qInputState.disabled}
          color="success"
          className="save-btn"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default QuestionInput;
