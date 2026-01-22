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
import { Dialog, DialogBody, DialogClose, DialogContent, DialogFooter, DialogHeader } from '@optiaxiom/react';
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
    const url = `${Util.CONSTANTS.SERVER_URL}/votes`;
    const payload = {
      qaId: item._id,
      up: true,
      q: isQuestion,
    };

    const { data } = await axios.patch(url, payload, {
      headers: {
        Authorization: `Bearer ${authCtx.getStoredValue().token}`,
        'Content-Type': 'application/json',
      },
    });
    setUdCnt(data);
  };

  const handleDownVote = async () => {
    const url = `${Util.CONSTANTS.SERVER_URL}/votes`;
    const payload = {
      qaId: item._id,
      up: false,
      q: isQuestion,
    };

    const { data } = await axios.patch(url, payload, {
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
    const url = `${Util.CONSTANTS.SERVER_URL}/questions/${item._id}/favourite`;

    const { data } = await axios.put(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${authCtx.getStoredValue().token}`,
          'Content-Type': 'application/json',
        },
      }
    );

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

  const detailsClassName = clickableDetails ? 'lt-QACard-right-pane-details-clickable' : '';
  const detailsOnClick = clickableDetails ? handleItemDetailsClick : undefined;

  return (
    <Box className="lt-QACard">
      <Flex flexDirection="row" gap="24" className="lt-QACard-body">
        <Flex flexDirection="column" gap="8" alignItems="center" className="lt-QACard-voting">
          <Button
            aria-label="upvote"
            onClick={handleUpVote}
            className="lt-QACard-voting-btn"
            disabled={!authCtx.isLoggedIn}
            icon={<GoArrowUp size={24} />}
          />
          <Text fontSize="xl" fontWeight="600" className="lt-QACard-voting-count">
            {udCnt.upVote - udCnt.downVote}
          </Text>
          <Button
            aria-label="downvote"
            onClick={handleDownVote}
            className="lt-QACard-voting-btn"
            disabled={!authCtx.isLoggedIn}
            icon={<GoArrowDown size={24} />}
          />
          {isQuestion && (
            <Flex flexDirection="column" alignItems="center" className="lt-QACard-answer-count" mt="16">
              <Text fontSize="2xl" fontWeight="700">
                {(item as Question).answers.length}
              </Text>
              <Text fontSize="sm">{(item as Question).answers.length === 1 ? 'Answer' : 'Answers'}</Text>
            </Flex>
          )}
        </Flex>

        <Flex flexDirection="column" flex="1" gap="16" className="lt-QACard-content">
          <Box className={detailsClassName} onClick={detailsOnClick}>
            <QuillTextEditor onEditorReady={onEditorReady} readOnly={true} showToolbar={false} />
          </Box>

          {item.imageLocations.length > 0 && (
            <Flex flexDirection="row" gap="12" flexWrap="wrap" className="lt-QACard-images">
              {item.imageLocations.map((file, index) => (
                <Box key={index} className="lt-QACard-image-wrapper">
                  <img
                    src={file}
                    alt={`Attachment ${index + 1}`}
                    className="lt-QACard-image"
                    onClick={() => handleImageModalOpen(file)}
                  />
                </Box>
              ))}
            </Flex>
          )}

          {isQuestion && (item as Question).tags.length > 0 && (
            <Flex flexDirection="row" gap="8" flexWrap="wrap" className="lt-QACard-tags">
              {(item as Question).tags.map((tag) => (
                <Badge key={tag._id} className="lt-QACard-tag">
                  {tag.name}
                </Badge>
              ))}
            </Flex>
          )}
        </Flex>
      </Flex>

      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" className="lt-QACard-footer">
        <Flex flexDirection="row" alignItems="center" gap="8">
          <Text fontWeight="600" className="lt-QACard-author">
            {item.userName}
          </Text>
        </Flex>

        <Flex flexDirection="row" gap="4" className="lt-QACard-actions">
          {isQuestion && (
            <Tooltip content={isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
              <Button
                aria-label="favourite"
                appearance="subtle"
                disabled={!authCtx.isLoggedIn}
                onClick={handleToggleFavourite}
                icon={<BiHeart size={20} color={isFavourite ? 'red' : 'currentColor'} />}
              />
            </Tooltip>
          )}
          <Tooltip content="Share">
            <Button
              aria-label="share"
              appearance="subtle"
              disabled={!authCtx.isLoggedIn}
              onClick={handleShareClick}
              icon={<BiShare size={20} />}
            />
          </Tooltip>
          <Tooltip content="Edit">
            <Button
              aria-label="edit"
              appearance="subtle"
              disabled={!isOwner}
              onClick={handleEdit}
              icon={<BiEdit size={20} />}
            />
          </Tooltip>
          <Tooltip content="Delete">
            <Button
              aria-label="delete"
              appearance="subtle"
              disabled={!isOwner && !isQOwner}
              onClick={handleDelete}
              icon={<BiTrash size={20} />}
            />
          </Tooltip>
        </Flex>
      </Flex>

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
