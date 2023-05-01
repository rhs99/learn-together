import { Types } from 'mongoose';
import Subject from '../models/subject';

type reqBody = {
  name: string;
  class: Types.ObjectId;
  isDeleted: boolean;
};

const getSubjects = async () => {
  try {
    const subjects = await Subject.find({ isDeleted: false });
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

const softDeleteSubject = async (body: reqBody) => {
  try {
    const subjects = await Subject.findOneAndUpdate({ name: body.name, class: body.class }, { isDeleted: true });
    return subjects;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

export default { getSubjects, addNewSubject, softDeleteSubject };
