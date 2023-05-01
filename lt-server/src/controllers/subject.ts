import { Request, Response } from 'express';
import SubjectService from '../services/subject';

const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await SubjectService.getSubjects();
    res.status(200).json(subjects);
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

const addNewSubject = async (req: Request, res: Response) => {
  try {
    await SubjectService.addNewSubject(req.body);
    res.status(201).json();
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

const softDeleteSubject = async (req: Request, res: Response) => {
  try {
    const subjects = await SubjectService.softDeleteSubject(req.body);
    res.status(200).json(subjects);
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

export default { getSubjects, addNewSubject, softDeleteSubject };
