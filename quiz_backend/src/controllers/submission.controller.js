const Submission = require('../models/submission.model');

class SubmissionController {
  // Get user's submissions
  async getUserSubmissions(req, res) {
    try {
      const submissions = await Submission.find({ user: req.user._id })
        .populate('quiz', 'title description')
        .sort('-createdAt');
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get leaderboard
  async getLeaderboard(req, res) {
    try {
      const { quizId, timeframe } = req.query;
      let dateFilter = {};

      // Apply timeframe filter
      if (timeframe === 'weekly') {
        dateFilter = {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        };
      } else if (timeframe === 'monthly') {
        dateFilter = {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        };
      }

      const leaderboard = await Submission.aggregate([
        {
          $match: {
            ...(quizId && { quiz: mongoose.Types.ObjectId(quizId) }),
            ...dateFilter
          }
        },
        {
          $group: {
            _id: '$user',
            totalScore: { $sum: '$score' },
            averageTime: { $avg: '$timeSpent' },
            quizzesTaken: { $sum: 1 }
          }
        },
        {
          $sort: { totalScore: -1 }
        },
        {
          $limit: 10
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $unwind: '$userDetails'
        },
        {
          $project: {
            username: '$userDetails.username',
            totalScore: 1,
            averageTime: 1,
            quizzesTaken: 1
          }
        }
      ]);

      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SubmissionController();
