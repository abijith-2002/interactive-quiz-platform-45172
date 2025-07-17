const Quiz = require('../models/quiz.model');
const Submission = require('../models/submission.model');
const User = require('../models/user.model');

class AnalyticsController {
  // Get overall analytics
  async getOverallAnalytics(req, res) {
    try {
      const totalUsers = await User.countDocuments({ role: 'user' });
      const totalQuizzes = await Quiz.countDocuments();
      const totalSubmissions = await Submission.countDocuments();

      const averageScore = await Submission.aggregate([
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$score' }
          }
        }
      ]);

      const quizParticipation = await Quiz.aggregate([
        {
          $lookup: {
            from: 'submissions',
            localField: '_id',
            foreignField: 'quiz',
            as: 'submissions'
          }
        },
        {
          $project: {
            title: 1,
            participantCount: { $size: '$submissions' }
          }
        }
      ]);

      res.json({
        totalUsers,
        totalQuizzes,
        totalSubmissions,
        averageScore: averageScore[0]?.avgScore || 0,
        quizParticipation
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get quiz-specific analytics
  async getQuizAnalytics(req, res) {
    try {
      const quizId = req.params.id;
      const submissions = await Submission.find({ quiz: quizId });

      const totalParticipants = submissions.length;
      const averageScore = submissions.reduce((acc, sub) => acc + sub.score, 0) / totalParticipants || 0;
      const averageTime = submissions.reduce((acc, sub) => acc + sub.timeSpent, 0) / totalParticipants || 0;

      const questionAnalysis = await Submission.aggregate([
        {
          $match: { quiz: mongoose.Types.ObjectId(quizId) }
        },
        {
          $unwind: '$answers'
        },
        {
          $group: {
            _id: '$answers.question',
            correctCount: {
              $sum: {
                $cond: [
                  { $eq: ['$answers.isCorrect', true] },
                  1,
                  0
                ]
              }
            },
            totalAttempts: { $sum: 1 }
          }
        }
      ]);

      res.json({
        totalParticipants,
        averageScore,
        averageTime,
        questionAnalysis
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AnalyticsController();
