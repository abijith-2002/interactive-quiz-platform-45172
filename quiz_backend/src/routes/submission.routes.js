const express = require('express');
const submissionController = require('../controllers/submission.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /submissions:
 *   get:
 *     tags: [Submissions]
 *     summary: Get user's submissions
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's submissions
 */
router.get('/', auth, submissionController.getUserSubmissions);

/**
 * @swagger
 * /submissions/leaderboard:
 *   get:
 *     tags: [Submissions]
 *     summary: Get leaderboard
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: quizId
 *         schema:
 *           type: string
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [weekly, monthly, all]
 *     responses:
 *       200:
 *         description: Leaderboard data
 */
router.get('/leaderboard', auth, submissionController.getLeaderboard);

module.exports = router;
