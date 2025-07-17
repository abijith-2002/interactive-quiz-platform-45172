const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /analytics/overall:
 *   get:
 *     tags: [Analytics]
 *     summary: Get overall analytics (admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics data
 */
router.get('/overall', adminAuth, analyticsController.getOverallAnalytics);

/**
 * @swagger
 * /analytics/quiz/{id}:
 *   get:
 *     tags: [Analytics]
 *     summary: Get quiz-specific analytics (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz-specific analytics data
 */
router.get('/quiz/:id', adminAuth, analyticsController.getQuizAnalytics);

module.exports = router;
