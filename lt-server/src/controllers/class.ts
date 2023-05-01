import { Request, Response } from 'express';
import ClassService from '../services/class';

const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await ClassService.getClasses();
    res.status(200).json(classes);
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

const addNewClass = async (req: Request, res: Response) => {
  try {
    await ClassService.addNewClass(req.body);
    res.status(201).json();
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

const softDeleteClass = async (req: Request, res: Response) => {
  try {
    const classes = await ClassService.softDeleteClass(req.body);
    res.status(200).json(classes);
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

export default { getClasses, addNewClass, softDeleteClass };
