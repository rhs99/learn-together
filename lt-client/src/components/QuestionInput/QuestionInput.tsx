import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect, useCallback, ChangeEvent, SyntheticEvent } from 'react';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import Util from '../../utils';
import axios from 'axios';
import { Question } from '../../types';
import AuthContext from '../../store/auth';
import { Button } from '@mui/material';
import { Tag } from '../../types';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import './_index.scss';

const filter = createFilterOptions<Tag>();

type QuestionInputProps = {
  chapterId: string;
  question?: Question;
};

const QuestionInput = (props: QuestionInputProps) => {
  const [imageLocations, setImageLocations] = useState<string[]>(props.question?.imageLocations || []);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(props.question?.tags || []);
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [editor, setEditor] = useState<Quill>();
  const [showAlert, setShowAlert] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/tags/list?chapterId=${props.chapterId}`;
    axios.get(URL).then((data) => setExistingTags(data.data));
  }, [props.chapterId]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (imageLocations.length > 0) {
      Util.deleteFile(imageLocations[0]);
    }
    if (event.target.files) {
      const file = event.target.files[0];
      await Util.uploadFile(file, setImageLocations);
    }
  };

  const handleSave = async () => {
    const description = editor?.getContents().ops || [];
    const text = editor?.getText() || '';

    if (text.trim().length === 0 || selectedTags.length === 0) {
      setShowAlert(true);
      return;
    }

    const tagURL = `${Util.CONSTANTS.SERVER_URL}/tags/create`;
    const question = {
      _id: props.question?._id || '',
      details: description,
      chapter: props.chapterId,
      tags: [],
      imageLocations: imageLocations,
    };

    const newTags: Tag[] = [];

    selectedTags.forEach((tag) => {
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
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });

    navigate(`/chapters/${props.chapterId}`);
  };

  const handleClose = () => {
    navigate(`/chapters/${props.chapterId}`);
  };

  const onEditorReady = useCallback(
    (editor: Quill) => {
      setEditor(editor);
      editor.setContents(props.question?.details || []);
    },
    [props.question?.details]
  );

  if (!authCtx.isLoggedIn) {
    return null;
  }

  return (
    <div className="cl-QuestionInput">
      {showAlert && (
        <Stack sx={{ width: '50%', margin: '10px auto' }}>
          <Alert
            severity="error"
            onClose={() => {
              setShowAlert(false);
            }}
          >
            <AlertTitle>Error</AlertTitle>
            Question <strong>description and tags</strong> cannot be empty!
          </Alert>
        </Stack>
      )}
      <div className="description-heading">
        <h3>Write Question Description</h3>
      </div>
      <QuillTextEditor onEditorReady={onEditorReady} />
      <div>
        <h4>Add Relevant Tags</h4>
      </div>
      <div className="tag-input-container">
        <Autocomplete
          multiple
          id="tags-standard"
          onChange={(event: SyntheticEvent<Element, Event>, selection: Tag[]) => {
            setSelectedTags(selection);
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
          defaultValue={selectedTags}
          renderInput={(params) => <TextField {...params} variant="standard" label="All Tags" placeholder="Add Tags" />}
        />
      </div>
      <div className="file-upload">
        <input type="file" accept="image/*" multiple={false} onChange={handleFileUpload} />
      </div>
      <div className="btn-container">
        <Button variant="outlined" onClick={handleClose} color="error" className="close-btn">
          Close
        </Button>
        <Button variant="contained" onClick={handleSave} color="success" className="save-btn">
          Save
        </Button>
      </div>
    </div>
  );
};

export default QuestionInput;
