import Privilege from '../models/privilege';

type reqBody = {
  name: string;
};

const getPrivileges = async () => {
  try {
    const privileges = await Privilege.find();
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

export default { getPrivileges, addNewPrivilege };
