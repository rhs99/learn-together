import { Types } from 'mongoose';
import Chapter from '../models/chapter';

type reqBody = {
  name: string;
  subject: Types.ObjectId;
  isDeleted: boolean;
};

const getChapters = async () => {
  try {
    const chapters = await Chapter.find({ isDeleted: false });
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

const softDeleteChapter = async (body: reqBody) => {
  try {
    const subjects = await Chapter.findOneAndUpdate({ name: body.name, subject: body.subject }, { isDeleted: true });
    return subjects;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

export default { getChapters, addNewChapter, softDeleteChapter };
