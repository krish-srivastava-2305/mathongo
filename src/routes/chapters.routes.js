import { Router } from 'express';
import { chapterController } from '../controllers/chapter.controllers.js';

const chaptersRouter = Router();

chaptersRouter.get('/', chapterController.getAllChapters);

export default chaptersRouter;