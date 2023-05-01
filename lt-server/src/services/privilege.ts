import Privilege from '../models/privilege';

type reqBody = {
  name: string;
  isDeleted: boolean;
};

const getPrivileges = async () => {
  try {
    const privileges = await Privilege.find({ isDeleted: false });
    return privileges;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

const addNewPrivilege = async (body: reqBody) => {
  try {
    const newPrivilege = new Privilege(body);
    await newPrivilege.save();
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

const softDeletePrivilege = async (body: reqBody) => {
  try {
    const subjects = await Privilege.findOneAndUpdate({ name: body.name }, { isDeleted: true });
    return subjects;
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
  }
};

export default { getPrivileges, addNewPrivilege, softDeletePrivilege };
