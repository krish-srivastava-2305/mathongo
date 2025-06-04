import mongoose, { Schema } from "mongoose";

const chapterSchema = new Schema({
    subject: {
    type: String,
    required: true,
    trim: true,
    enum: ['Physics', 'Chemistry', 'Mathematics', 'Biology'] // Add more subjects as needed
  },
  chapter: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true,
    enum: ['Class 9', 'Class 10', 'Class 11', 'Class 12'] // Add more classes as needed
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  yearWiseQuestionCount: {
    type: Map,
    of: Number,
    default: new Map(),
    validate: {
      validator: function(map) {
        // Validate that all keys are valid years and values are non-negative numbers
        for (let [year, count] of map) {
          if (!/^\d{4}$/.test(year) || count < 0) {
            return false;
          }
        }
        return true;
      },
      message: 'Year must be a 4-digit number and count must be non-negative'
    }
  },
  questionSolved: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Not Started', 'In Progress', 'Completed', 'Under Review'],
    default: 'Not Started'
  },
  isWeakChapter: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
})

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;
