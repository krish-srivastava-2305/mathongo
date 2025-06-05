import APIError from "../configure/error.configure.js";
import redis from "../configure/redis.configure.js";
import Chapter from "../models/chapter.model.js";

const getAllChapters = async (req, res, next) => {
    try {
        const chaptersCache = await redis.get('chapters');
        let chapters;
        if (chaptersCache) {
            console.log("Cache used for chapters");
            chapters = JSON.parse(chaptersCache);
        } else {
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
            page = 1, 
            limit = 10 
        } = req.query;

        // Convert page and limit to numbers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        let filteredChapters = chapters;
        
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
        const chapterId = req.params.chapterId;

        const chapterCache = await redis.get(`chapter:${chapterId}`);

        if (chapterCache) {
            return res.status(200).json({
                message: "Chapter fetched from cache",
                status: 200,
                data: JSON.parse(chapterCache)
            });
        }

        const chapter = await Chapter.findById(chapterId);

        if (!chapter) {
            throw new APIError("No chapter found", 404);
        }

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