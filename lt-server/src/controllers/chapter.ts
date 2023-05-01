import { Request, Response } from 'express';
import ChapterService from '../services/chapter';

const getChapters = async (req: Request, res: Response) => {
  try {
    const chapters = await ChapterService.getChapters();
    res.status(200).json(chapters);
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

const addNewChapter = async (req: Request, res: Response) => {
  try {
    await ChapterService.addNewChapter(req.body);
    res.status(201).json();
  } catch (e) {
    if (e instanceof Error) res.status(400).json({ message: e.message });
  }
};

export default { getChapters, addNewChapter };
