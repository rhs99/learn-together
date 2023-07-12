import { useEffect, useState } from 'react';
import { Answer, Question } from '../../types';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import QuizIcon from '@mui/icons-material/Quiz';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Util from '../../utils';
import { Stack, Typography } from '@mui/material';
import ProfileCard from '../../components/ProfileCard/ProfileCard';

const Profile = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [userId, setUserId] = useState(null);
  const [_class, setClass] = useState(null);
  const [upvoteCnt, setUpvoteCnt] = useState(0);
  const [downvoteCnt, setDownvoteCnt] = useState(0);
  const { userName } = useParams();
  useEffect(() => {
    const URL = `${Util.CONSTANTS.SERVER_URL}/users?userName=${userName}`;
    axios.get(URL).then(({ data }) => {
      setUserId(data[0]._id);
      setClass(data[0].class);
      setQuestions(data[0].questions);
      setAnswers(data[0].answers);
    });
  }, [userName]);
  useEffect(() => {
    if (userId === null || userId === undefined) return;
    console.log(userId);
    const URL = `${Util.CONSTANTS.SERVER_URL}/votes/countUpvotes?userId=${userId}`;
    axios
      .get(URL)
      .then(({ data }) => {
        setUpvoteCnt(data.length);
      })
      .catch((e) => console.log(e));
  }, [userId]);
  useEffect(() => {
    if (userId === null || userId === undefined) return;
    const URL = `${Util.CONSTANTS.SERVER_URL}/votes/countDownvotes?userId=${userId}`;
    axios
      .get(URL)
      .then(({ data }) => {
        setDownvoteCnt(data.length);
        console.log(data);
      })
      .catch((e) => console.log(e));
  }, [userId]);
  return (
    <Stack direction="column" spacing={2} sx={{ mx: 'auto', alignItems: 'center' }}>
      <Stack direction="row">
        <AccountBoxIcon sx={{ color: 'gray', width: '200px', height: '200px' }} />
        <div>
          <Typography>{userName}</Typography>
          <Typography> Class : {_class}</Typography>
        </div>
      </Stack>

      <ProfileCard icon={<ThumbUpIcon />} label={upvoteCnt} details="total given upvotes" />
      <ProfileCard icon={<ThumbDownIcon />} label={downvoteCnt} details="total given downvotes" />
      <ProfileCard icon={<QuizIcon />} label={questions.length} details="total asked questions" />
      <ProfileCard icon={<QuestionAnswerIcon />} label={answers.length} details="total given answers" />
    </Stack>
  );
};

export default Profile;
