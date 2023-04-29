import Class from '../models/class';

type reqBody = {
  name: string;
};

const getClasses = async () => {
  try {
    const classes = await Class.find();
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

export default { getClasses, addNewClass };
