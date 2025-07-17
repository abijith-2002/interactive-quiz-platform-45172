const Quiz = require('../models/quiz.model');
const Submission = require('../models/submission.model');
const ResponseUtil = require('../utils/response.util');
const mongoose = require('mongoose');

class QuizController {
  // Create new quiz (admin only)
  async create(req, res) {
    try {
      // Verify at least one correct option per question
      for (const question of req.body.questions) {
        const hasCorrectOption = question.options.some(opt => opt.isCorrect);
        if (!hasCorrectOption) {
          return ResponseUtil.validationError(res, {
            message: `Question "${question.text}" must have at least one correct option`
          });
        }
      }

      const quiz = new Quiz({
        ...req.body,
        createdBy: req.user._id
      });
      await quiz.save();
      
      return ResponseUtil.success(
        res,
        201,
        'Quiz created successfully',
        quiz
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ResponseUtil.validationError(res, error.errors);
      }
      return ResponseUtil.error(res, 500, error.message);
    }
  }

  // Get all published quizzes
  async getPublished(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [quizzes, total] = await Promise.all([
        Quiz.find({ isPublished: true })
          .select('-questions.options.isCorrect')
          .sort('-createdAt')
          .skip(skip)
          .limit(limit)
          .populate('createdBy', 'username'),
        Quiz.countDocuments({ isPublished: true })
      ]);

      return ResponseUtil.success(res, 200, 'Quizzes retrieved successfully', {
        quizzes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return ResponseUtil.error(res, 500, error.message);
    }
  }

  // Get single quiz by ID
  async getById(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return ResponseUtil.validationError(res, {
          message: 'Invalid quiz ID format'
        });
      }

      const quiz = await Quiz.findById(req.params.id)
        .select('-questions.options.isCorrect')
        .populate('createdBy', 'username');

      if (!quiz) {
        return ResponseUtil.notFound(res, 'Quiz not found');
      }

      return ResponseUtil.success(
        res,
        200,
        'Quiz retrieved successfully',
        quiz
      );
    } catch (error) {
      return ResponseUtil.error(res, 500, error.message);
    }
  }

  // Update quiz (admin only)
  async update(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return ResponseUtil.validationError(res, {
          message: 'Invalid quiz ID format'
        });
      }

      if (req.body.questions) {
        // Verify at least one correct option per question
        for (const question of req.body.questions) {
          const hasCorrectOption = question.options.some(opt => opt.isCorrect);
          if (!hasCorrectOption) {
            return ResponseUtil.validationError(res, {
              message: `Question "${question.text}" must have at least one correct option`
            });
          }
        }
      }

      const quiz = await Quiz.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!quiz) {
        return ResponseUtil.notFound(res, 'Quiz not found or unauthorized');
      }

      return ResponseUtil.success(
        res,
        200,
        'Quiz updated successfully',
        quiz
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ResponseUtil.validationError(res, error.errors);
      }
      return ResponseUtil.error(res, 500, error.message);
    }
  }

  // Delete quiz (admin only)
  async delete(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return ResponseUtil.validationError(res, {
          message: 'Invalid quiz ID format'
        });
      }

      const quiz = await Quiz.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user._id
      });

      if (!quiz) {
        return ResponseUtil.notFound(res, 'Quiz not found or unauthorized');
      }

      // Delete all submissions for this quiz
      await Submission.deleteMany({ quiz: req.params.id });

      return ResponseUtil.success(
        res,
        200,
        'Quiz and related submissions deleted successfully'
      );
    } catch (error) {
      return ResponseUtil.error(res, 500, error.message);
    }
  }

  // Submit quiz answers
  async submit(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return ResponseUtil.validationError(res, {
          message: 'Invalid quiz ID format'
        });
      }

      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
        return ResponseUtil.notFound(res, 'Quiz not found');
      }

      if (!quiz.isPublished) {
        return ResponseUtil.forbidden(res, 'This quiz is not available for submission');
      }

      // Check if user has already submitted this quiz
      const existingSubmission = await Submission.findOne({
        quiz: quiz._id,
        user: req.user._id
      });

      if (existingSubmission) {
        return ResponseUtil.forbidden(res, 'You have already submitted this quiz');
      }

      const { answers, timeSpent } = req.body;

      // Validate all question IDs exist in the quiz
      const validQuestionIds = quiz.questions.map(q => q._id.toString());
      const invalidAnswers = answers.filter(a => !validQuestionIds.includes(a.question));
      
      if (invalidAnswers.length > 0) {
        return ResponseUtil.validationError(res, {
          message: 'Invalid question IDs in submission'
        });
      }

      let score = 0;
      const detailedResults = [];

      // Calculate score
      answers.forEach(answer => {
        const question = quiz.questions.id(answer.question);
        if (question) {
          const correctOption = question.options.find(opt => opt.isCorrect);
          const isCorrect = correctOption && correctOption._id.toString() === answer.selectedOption;
          
          if (isCorrect) {
            score += question.points;
          }

          detailedResults.push({
            question: question.text,
            isCorrect,
            points: isCorrect ? question.points : 0,
            correctAnswer: correctOption.text
          });
        }
      });

      const submission = new Submission({
        quiz: quiz._id,
        user: req.user._id,
        answers,
        score,
        timeSpent,
        maxScore: quiz.questions.reduce((sum, q) => sum + q.points, 0)
      });

      await submission.save();

      return ResponseUtil.success(
        res,
        201,
        'Quiz submitted successfully',
        {
          submission,
          score,
          totalQuestions: quiz.questions.length,
          detailedResults
        }
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ResponseUtil.validationError(res, error.errors);
      }
      return ResponseUtil.error(res, 500, error.message);
    }
  }
}

module.exports = new QuizController();
