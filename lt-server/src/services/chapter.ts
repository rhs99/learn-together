import { Types } from 'mongoose';
import Chapter from '../models/chapter';

type reqBody = {
  name: string;
  subject: Types.ObjectId;
};

const getChapters = async () => {
  try {
    const chapters = await Chapter.find();
    return chapters;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

const addNewChapter = async (body: reqBody) => {
  try {
    const newChapter = new Chapter(body);
    await newChapter.save();
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

export default { getChapters, addNewChapter };
