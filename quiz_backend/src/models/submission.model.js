const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Quiz'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
