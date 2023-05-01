import { Request, Response } from 'express';
import PrivilegeService from '../services/privilege';

const getPrivileges = async (req: Request, res: Response) => {
  try {
    const privileges = await PrivilegeService.getPrivileges();
    res.status(200).json(privileges);
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

const addNewPrivilege = async (req: Request, res: Response) => {
  try {
    await PrivilegeService.addNewPrivilege(req.body);
    res.status(201).json();
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

const softDeletePrivilege = async (req: Request, res: Response) => {
  try {
    const privileges = await PrivilegeService.softDeletePrivilege(req.body);
    res.status(200).json(privileges);
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

export default { getPrivileges, addNewPrivilege, softDeletePrivilege };
