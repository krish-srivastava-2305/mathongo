import { Router } from 'express';
import { chapterController } from '../controllers/chapter.controllers.js';
import { body, param, query }  from  "express-validator"
import reqValidator from '../middlewares/reqValidator.middleware.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const chaptersRouter = Router();


// Validation rules for filtering chapters
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

// Validation rules for chapter creation
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

// Route definitions
// GET /api/v1/chapters - Get all chapters with optional filtering
chaptersRouter.get('/',
    filterValidation,
    reqValidator,
    chapterController.getAllChapters
);

// GET /api/v1/chapters/:chapterId - Get a specific chapter by ID
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

// POST /api/v1/chapters - Create a new chapter (admin only)
// This route is protected by adminMiddleware to ensure only admins can create chapters
chaptersRouter.post("/", 
    adminMiddleware, 
    chapterCreationValidation,
    reqValidator,
    chapterController.createChapter
);

export default chaptersRouter;