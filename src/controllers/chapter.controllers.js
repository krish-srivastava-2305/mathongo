import APIError from "../configure/error.configure.js";
import redis from "../configure/redis.configure.js";
import Chapter from "../models/chapter.model.js";

const getAllChapters = async (req, res, next) => {
    /*
        Controller to handle fetching all chapters with optional filtering and pagination.
        It first checks the Redis cache for chapters, if not found, it fetches from the database.
        It supports filtering by class, unit, status, weak chapters, and subject.
        Pagination is implemented with default values for page and limit.  
    */
    try {
        // Check Redis cache for chapters
        const chaptersCache = await redis.get('chapters');
        let chapters;
        if (chaptersCache) {
            console.log("Cache used for chapters");
            chapters = JSON.parse(chaptersCache);
        } else {
            // Fetch chapters from the database if not found in cache
            console.log("Cache miss for chapters, fetching from database");
            chapters = await Chapter.find({})
                .sort({ class: 1, unit: 1, chapter: 1 })
                .select("-__v -createdAt -updatedAt");
            await redis.set('chapters', JSON.stringify(chapters), 'EX', 60 * 60);
        }

        if (!chapters || chapters.length === 0) {
            throw new APIError("No chapters found", 400);
        }

        // Filter chapters based on query parameters
        const { 
            class: classFilter, 
            unit, 
            status, 
            weakChapters, 
            subject, 
            page = 1, // Default to page 1 if not provided
            limit = 10 // Default to 10 items per page if not provided
        } = req.query;

        // Convert page and limit to numbers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        let filteredChapters = chapters;
        
        // Apply filters based on query parameters
        if (classFilter) {
            filteredChapters = filteredChapters.filter(chapter => 
                chapter.class.toLowerCase() === classFilter.toLowerCase()
            );
        }
        if (unit) {
            filteredChapters = filteredChapters.filter(chapter => 
                chapter.unit.toLowerCase() === unit.toLowerCase()
            );
        }
        if (status) {
            filteredChapters = filteredChapters.filter(chapter => 
                chapter.status.toLowerCase() === status.toLowerCase()
            );
        }
        if (weakChapters !== undefined) {
            filteredChapters = filteredChapters.filter(chapter => 
                chapter.isWeakChapter === (weakChapters === 'true')
            );
        }
        if (subject) {
            filteredChapters = filteredChapters.filter(chapter => 
                chapter.subject.toLowerCase() === subject.toLowerCase()
            );
        }

        // Validate pagination parameters
        const totalChapters = filteredChapters.length;
        const totalPages = Math.ceil(totalChapters / limitNum);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        
        const paginatedChapters = filteredChapters.slice(startIndex, endIndex);
        

        // Add pagination metadata
        const pagination = {
            totalChapters,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        };
 
        res.status(200).json({
            message: "Chapters fetched successfully",
            status: 200,
            data: paginatedChapters,
            pagination
        });
        
    } catch (error) {
        next(error);
    }
}

const getChapter = async (req, res, next) => { 
    try {
        /* 
            Note: Request is already validated by express-validator in the route file.
            Controller to handle fetching a single chapter by its ID.
            It first checks the Redis cache for the chapter, if not found, it fetches from the database.
            If the chapter is not found in either location, it throws an error.
        */
        const chapterId = req.params.chapterId;

        // Check Redis cache for chapter
        const chapterCache = await redis.get(`chapter:${chapterId}`);

        // If chapter is found in cache, return it
        if (chapterCache) {
            return res.status(200).json({
                message: "Chapter fetched from cache",
                status: 200,
                data: JSON.parse(chapterCache)
            });
        }

        // If chapter is not found in cache, fetch from database
        const chapter = await Chapter.findById(chapterId);

        if (!chapter) {
            throw new APIError("No chapter found", 404);
        }

        // Save the chapter to Redis cache for future requests
        // Set an expiration time of 1 hour (3600 seconds)
        await redis.set(`chapter:${chapterId}`, JSON.stringify(chapter), 'EX', 60 * 60);

        res.status(200).json({
            message: "Chapter fetched successfully",
            status: 200,
            data: chapter
        });

    } catch (error) {
        next(error);
    }
}

const createChapter = async (req, res, next) => {
    try {
        /*
            Controller to handle creating a new chapter.
            It checks if the user is an admin before allowing the creation.
            If the user is not an admin, it throws an error.
            After creating the chapter, it clears the chapters cache to ensure fresh data.
        */
        const { class: className, chapter, unit, subject } = req.body;

        if (!req.user || req.user !== 'admin') {
            throw new APIError("Unauthorized access", 403);
        }

        const newChapter = new Chapter({
            class: className,
            chapter,
            unit,
            subject
        })

        await newChapter.save();
        
        await redis.del('chapters');


        /* 
            Optionally, we can update the cache and prevent cache miss for users increasing UX
            as this route will be used by admins to whom UX is not a priority. 
        */

        // const chapters = await Chapter.find({})
        //     .sort({ class: 1, unit: 1, chapter: 1 })
        //     .select("-__v -createdAt -updatedAt");
        // await redis.set('chapters', JSON.stringify(chapters), 'EX', 60 * 60);

        res.status(201).json({
            message: "Chapter created successfully",
            status: 201,
            data: newChapter
        });

    } catch (error) {
        next(error);
    }

}

export const chapterController = {
    getAllChapters,
    getChapter,
    createChapter
};