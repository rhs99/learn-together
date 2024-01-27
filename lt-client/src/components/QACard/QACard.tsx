import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext, useCallback } from 'react';
import Quill from 'quill';
import { Question, Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';
import Button from '../../design-library/Button/Button';
import Icon from '../../design-library/Icon';
import Modal from '../../design-library/Modal/Modal';
import Tooltip from '../../design-library/Tooltip/Tooltip';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';

import './_index.scss';

type QACardProps = {
  item: Question | Answer;
  isQuestion: boolean;
  clickableDetails: boolean;
  handleItemDelete: (_id: string) => void;
};

const QACard = ({ item, isQuestion, clickableDetails, handleItemDelete }: QACardProps) => {
  const [imageToShow, setImageToShow] = useState<string>('');
  const [udCnt, setUdCnt] = useState({ upVote: item.upVote, downVote: item.downVote });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [qOwner, setQOwner] = useState('');
  const [isFavourite, setIsFavourite] = useState(isQuestion && (item as Question).isFavourite);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const qId = isQuestion ? '' : (item as Answer).question;

  const handleImageModalOpen = (url: string) => {
    setImageToShow(url);
  };

  const handleImageModalClose = () => {
    setImageToShow('');
  };

  useEffect(() => {
    if (!isQuestion) {
      const url = `${Util.CONSTANTS.SERVER_URL}/questions/${qId}`;
      axios.get(url).then(({ data }) => {
        setQOwner(data.userName);
      });
    }
  }, [isQuestion, qId]);

  const handleItemDetailsClick = () => {
    if (isQuestion) navigate(`/questions/${item._id}`);
  };

  const handleShareClick = () => {
    const url = `${Util.CONSTANTS.CLIENT_URL}/${isQuestion ? 'questions' : 'answers'}/${item._id}`;
    navigator.clipboard.writeText(url);
  };

  const handleUpVote = async () => {
    const url = `${Util.CONSTANTS.SERVER_URL}/votes/update`;
    const payload = {
      qaId: item._id,
      up: true,
      q: isQuestion,
    };

    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setUdCnt(data);
  };

  const handleDownVote = async () => {
    const url = `${Util.CONSTANTS.SERVER_URL}/votes/update`;
    const payload = {
      qaId: item._id,
      up: false,
      q: isQuestion,
    };

    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setUdCnt(data);
  };

  const handleEdit = () => {
    navigate(`/${isQuestion ? 'questions' : 'answers'}/${item._id}/edit`);
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleToggleFavourite = async () => {
    if (!isQuestion) {
      return;
    }
    const url = `${Util.CONSTANTS.SERVER_URL}/questions/favourite`;
    const payload = {
      questionId: item._id,
    };

    const { data } = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });

    setIsFavourite(data.favourite);
  };

  const handleConfirmDelete = async () => {
    const url = `${Util.CONSTANTS.SERVER_URL}/${isQuestion ? 'questions' : 'answers'}/${item._id}`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        },
      })
      .then(() => {
        handleItemDelete(item._id);
      });
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
  };

  const onEditorReady = useCallback(
    (editor: Quill) => {
      if (item?.details) {
        editor.setContents(item?.details);
      }
    },
    [item]
  );

  const isOwner = authCtx.getStoredValue().userName === item.userName;
  const isQOwner = authCtx.getStoredValue().userName === qOwner && qOwner.length !== 0;

  const detailsClassName = clickableDetails ? 'detailsClickable' : '';
  const detailsOnClick = clickableDetails ? handleItemDetailsClick : undefined;

  return (
    <div className="cl-QACard">
      <div className="qa-Body">
        <div className="left-pane">
          <div className="UD-container">
            <Icon onClick={handleUpVote} name="arrow-up" size={20} />
            <p>{udCnt.upVote - udCnt.downVote}</p>
            <Icon onClick={handleDownVote} name="arrow-down" size={20} />
          </div>
          <div className="info">
            <p>Up: {udCnt.upVote}</p>
            <p>Down: {udCnt.downVote}</p>
            {isQuestion && <p>Ans: {(item as Question).answers.length}</p>}
          </div>
          {isQuestion && (
            <div className="tags">
              {(item as Question).tags.map((tag) => (
                <span key={tag._id} className="tag">
                  {tag.name}{' '}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="right-pane">
          <div className={detailsClassName} onClick={detailsOnClick}>
            <QuillTextEditor onEditorReady={onEditorReady} readOnly={true} showToolbar={false} />
          </div>
          {item.imageLocations.length > 0 && (
            <div className="imageContainer">
              {item.imageLocations.map((file, index) => (
                <img key={index} src={file} className="image" onClick={() => handleImageModalOpen(file)} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="bottom-pane">
        <span className="author">{item.userName}</span>
        <Tooltip content="favourite">
          <Icon
            disabled={!authCtx.isLoggedIn}
            color={isFavourite ? 'red' : 'black'}
            name="favourite"
            onClick={handleToggleFavourite}
          />
        </Tooltip>
        <Tooltip content="share">
          <Icon onClick={handleShareClick} name="share" />
        </Tooltip>
        <Tooltip content="edit">
          <Icon disabled={!isOwner} onClick={handleEdit} name="edit" />
        </Tooltip>
        <Tooltip content="delete">
          <Icon disabled={!isOwner && !isQOwner} onClick={handleDelete} name="delete" />
        </Tooltip>
      </div>
      {imageToShow.length > 0 && (
        <Modal isShown={imageToShow.length > 0} onClose={handleImageModalClose}>
          <img src={imageToShow} style={{ width: '100%', height: 'auto' }} />
        </Modal>
      )}
      {openDeleteModal && (
        <Modal
          isShown={openDeleteModal}
          onClose={handleDeleteModalClose}
          title="Do you want to delete this question?"
          footer={
            <div style={{ display: 'flex', gap: '5px' }}>
              <Button onClick={handleDeleteModalClose} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} variant="danger">
                Confirm
              </Button>
            </div>
          }
        >
          <p style={{ paddingLeft: '10px' }}>
            Click <strong>Confirm</strong> to delete!
          </p>
        </Modal>
      )}
    </div>
  );
};

export default QACard;
