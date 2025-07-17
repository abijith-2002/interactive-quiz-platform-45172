const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  points: {
    type: Number,
    default: 1
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 1
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
