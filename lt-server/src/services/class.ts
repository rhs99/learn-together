import Class from '../models/class';

type reqBody = {
  name: string;
  isDeleted: boolean;
};

const getClasses = async () => {
  try {
    const classes = await Class.find({ isDeleted: false });
    return classes;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

const addNewClass = async (body: reqBody) => {
  try {
    const newClass = new Class(body);
    await newClass.save();
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

const softDeleteClass = async (body: reqBody) => {
  try {
    const subjects = await Class.findOneAndUpdate({ name: body.name }, { isDeleted: true });
    return subjects;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

export default { getClasses, addNewClass, softDeleteClass };
