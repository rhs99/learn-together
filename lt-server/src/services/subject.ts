import { Types } from 'mongoose';
import Subject from '../models/subejct';

type reqBody = {
  name: string;
  class: Types.ObjectId;
};

const getSubjects = async () => {
  try {
    const subjects = await Subject.find();
    return subjects;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

const addNewSubject = async (body: reqBody) => {
  try {
    const newSubject = new Subject(body);
    await newSubject.save();
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

export default { getSubjects, addNewSubject };
