const express = require('express');
const quizController = require('../controllers/quiz.controller');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /quizzes:
 *   post:
 *     tags: [Quizzes]
 *     summary: Create a new quiz (admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 */
router.post('/', adminAuth, quizController.create);

/**
 * @swagger
 * /quizzes:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get all published quizzes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of published quizzes
 */
router.get('/', auth, quizController.getPublished);

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get quiz by ID
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
 *         description: Quiz details
 */
router.get('/:id', auth, quizController.getById);

/**
 * @swagger
 * /quizzes/{id}:
 *   put:
 *     tags: [Quizzes]
 *     summary: Update quiz (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 */
router.put('/:id', adminAuth, quizController.update);

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     tags: [Quizzes]
 *     summary: Delete quiz (admin only)
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
 *         description: Quiz deleted successfully
 */
router.delete('/:id', adminAuth, quizController.delete);

/**
 * @swagger
 * /quizzes/{id}/submit:
 *   post:
 *     tags: [Quizzes]
 *     summary: Submit quiz answers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     selectedOption:
 *                       type: string
 *               timeSpent:
 *                 type: number
 *     responses:
 *       201:
 *         description: Quiz submitted successfully
 */
router.post('/:id/submit', auth, quizController.submit);

module.exports = router;
