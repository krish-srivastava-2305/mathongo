import APIError from "../configure/error.configure.js";
import Chapter from "../models/chapter.model.js";

const getAllChapters = async (req, res, next) => {
    try {
        const chapters = await Chapter.find({})
            .sort({ class: 1, unit: 1, chapter: 1 })
            .select("-__v -createdAt -updatedAt");

        if (!chapters || chapters.length === 0) {
            throw new APIError("No chapters found", 400);
        }

        res.status(200).json({
            message: "Chapters fetched successfully",
            status: 200,
            data: chapters
        });
        
    } catch (error) {
        next(error);
    }
}

export const chapterController = {
    getAllChapters
}