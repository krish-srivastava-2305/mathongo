import { Router } from 'express';
import { chapterController } from '../controllers/chapter.controllers.js';
import { body, param, query }  from  "express-validator"
import reqValidator from '../middlewares/reqValidator.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const chaptersRouter = Router();

const filterValidation = [
  query('class')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Class must be a non-empty string'),
  
  query('unit')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Unit must be a non-empty string'),
  
  query('status')
    .optional()
    .isIn(['Completed', 'In Progress', 'Not Started'])
    .withMessage('Status must be one of: Completed, In Progress, Not Started'),
  
  query('weakChapters')
    .optional()
    .isBoolean()
    .withMessage('weakChapters must be a boolean value'),
  
  query('subject')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Subject must be a non-empty string'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be a positive integer between 1 and 100')
    .toInt()
];

const chapterCreationValidation = [
    body("class")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Class is required and must be a non-empty string"),
    body("chapter")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Chapter is required and must be a non-empty string"),
    body("unit")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Unit is required and must be a non-empty string"),
    body("subject")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Subject is required and must be a non-empty string")
]

chaptersRouter.get('/',
    filterValidation,
    reqValidator,
    chapterController.getAllChapters
);

chaptersRouter.get("/:chapterId",
    [
        param("chapterId")
            .isMongoId()
            .withMessage("Invalid chapter ID format")
            .notEmpty()
            .withMessage("Chapter ID cannot be empty")
    ],
    reqValidator,
    chapterController.getChapter
);

chaptersRouter.post("/", 
    adminMiddleware, 
    chapterCreationValidation,
    reqValidator,
    chapterController.createChapter
);

export default chaptersRouter;