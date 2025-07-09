import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext, useCallback } from 'react';
import Quill from 'quill';
import { Question, Answer } from '../../types';
import Util from '../../utils';
import axios from 'axios';
import AuthContext from '../../store/auth';
import ConfirmationModal from '../../design-library/ConfirmationModal/ConfirmationModal';
import QuillTextEditor from '../Quill TextEditor/QuillTextEditor';

import { Box, Button, Tooltip, Badge, Text, Flex } from '@optiaxiom/react';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  theme,
} from '@optiaxiom/react';
import { BiShare, BiHeart, BiEdit, BiTrash } from 'react-icons/bi';
import { GoArrowUp, GoArrowDown } from 'react-icons/go';

import useAlert from '../../hooks/use-alert';

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
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const onAlert = useAlert();

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
    onAlert('Link copied to clipboard', 'success');
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
    setIsLoading(true);
    const url = `${Util.CONSTANTS.SERVER_URL}/${isQuestion ? 'questions' : 'answers'}/${item._id}`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        },
      })
      .then(() => {
        handleItemDelete(item._id);
      })
      .finally(() => {
        setIsLoading(false);
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

  const detailsClassName = clickableDetails ? 'lt-QACard-right-pane-details-clickable' : '';
  const detailsOnClick = clickableDetails ? handleItemDetailsClick : undefined;

  return (
    <Box className="lt-QACard">
      <Flex flexDirection="row" gap="16" className="lt-QACard-body">
        <Flex flexDirection="column" gap="16">
          <Flex flexDirection="column" gap="2" alignItems="center">
            <Button aria-label="upvote" icon={<GoArrowUp onClick={handleUpVote} size={20} />} />
            <Text>{udCnt.upVote - udCnt.downVote}</Text>
            <Button aria-label="downvote" icon={<GoArrowDown onClick={handleDownVote} size={20} />} />
          </Flex>
          {isQuestion && <Text>Ans: {(item as Question).answers.length}</Text>}
        </Flex>

        <Flex flexDirection="row" gap="24" className="lt-QACard-right-pane">
          <Box className={detailsClassName} onClick={detailsOnClick}>
            <QuillTextEditor onEditorReady={onEditorReady} readOnly={true} showToolbar={false} />
          </Box>
          {item.imageLocations.length > 0 && (
            <Flex flexDirection="row" gap="8">
              {item.imageLocations.map((file, index) => (
                <img
                  key={index}
                  src={file}
                  className="lt-QACard-right-pane-image"
                  onClick={() => handleImageModalOpen(file)}
                />
              ))}
            </Flex>
          )}
        </Flex>
      </Flex>
      <Box className="lt-QACard-bottom-pane">
        {isQuestion && (
          <Flex flexDirection="row" gap="2">
            {(item as Question).tags.map((tag) => (
              <Badge key={tag._id} className="lt-QACard-bottom-pane-tag">
                {tag.name}{' '}
              </Badge>
            ))}
          </Flex>
        )}
        <Flex flexDirection="row" justifyContent="space-between">
          <Text>{item.userName}</Text>
          <Flex flexDirection="row" gap="2">
            <Tooltip content="Add to favourites">
              <Button
                aria-label="favourite"
                disabled={!authCtx.isLoggedIn}
                icon={<BiHeart color={isFavourite ? 'red' : 'currentColor'} onClick={handleToggleFavourite} />}
              />
            </Tooltip>
            <Tooltip content="Share">
              <Button aria-label="share" disabled={!authCtx.isLoggedIn} icon={<BiShare onClick={handleShareClick} />} />
            </Tooltip>
            <Tooltip content="Edit">
              <Button aria-label="edit" disabled={!isOwner} icon={<BiEdit onClick={handleEdit} />} />
            </Tooltip>
            <Tooltip content="Delete">
              <Button aria-label="delete" disabled={!isOwner && !isQOwner} icon={<BiTrash onClick={handleDelete} />} />
            </Tooltip>
          </Flex>
        </Flex>
      </Box>

      {imageToShow.length > 0 && (
        <Dialog open={imageToShow.length > 0} onOpenChange={handleImageModalClose}>
          <DialogContent>
            <DialogHeader>Image Preview</DialogHeader>
            <DialogBody>
              <img src={imageToShow} alt="Enlarged view" className="lt-QACard-modal-image" />
            </DialogBody>
          </DialogContent>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </Dialog>
      )}
      {openDeleteModal && (
        <ConfirmationModal
          isShown={openDeleteModal}
          onCancel={handleDeleteModalClose}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          action="Delete"
          appearance="danger"
        >
          Are you sure you want to delete this {isQuestion ? 'question' : 'answer'}? This action cannot be undone.
        </ConfirmationModal>
      )}
    </Box>
  );
};

export default QACard;
