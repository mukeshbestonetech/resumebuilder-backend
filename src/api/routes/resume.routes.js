const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const resumeController = require('../controllers/resume.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: Resume management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *    Resume:
 *      type: object
 *      required:
 *        - title
 *        - professionalSummary
 *        - skills
 *      properties:
 *        title:
 *          type: string
 *          description: The title of the resume.
 *        professionalSummary:
 *          type: string
 *          description: A brief professional summary.
 *        skills:
 *          type: array
 *          items:
 *            type: string
 *          description: A list of skills.
 */

// All resume routes are protected by the auth middleware
router.use(authMiddleware);

/**
 * @swagger
 * /resumes/generate-summary:
 *  post:
 *    summary: Generate a professional summary
 *    tags: [Resumes]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              skills:
 *                type: array
 *                items:
 *                  type: string
 *    responses:
 *      "200":
 *        description: Professional summary generated successfully.
 *      "400":
 *        description: Invalid request.
 */
router.post('/generate-summary', resumeController.generateProfessionalSummary);

/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: Get all resumes for the logged-in user
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: A list of resumes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resume'
 *       "500":
 *         description: Server error.
 */
router.get('/', resumeController.getResumes);
/**
 * @swagger
 * /resumes:
 *   post:
 *     summary: Create a new resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               professionalSummary:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               workExperience:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       company:
 *                         type: string
 *                       role:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       description:
 *                         type: string
 *               education:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       degree:
 *                         type: string
 *                       fieldOfStudy:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       institution:
 *                         type: string
 *               template:
 *                 type: string
 *                 description: The template to use for the resume.
 *     responses:
 *       "201":
 *         description: Resume created successfully.
 *       "400":
 *         description: Invalid request.
 */
router.post('/', resumeController.createResume);

/**
 * @swagger
 * /resumes/{id}:
 *  put:
 *    summary: Update a resume by ID
 *    tags: [Resumes]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The resume ID.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              professionalSummary:
 *                type: string
 *              skills:
 *                type: array
 *                items:
 *                  type: string
 *    responses:
 *      "200":
 *        description: Resume updated successfully.
 *      "400":
 *        description: Invalid request.
 *      "404":
 *        description: Resume not found.
 */
router.put('/:id', resumeController.updateResume);

/**
 * @swagger
 * /resumes/generate-pdf:   
 *   post:
 *     summary: Generate a PDF version of a resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       "200":
 *         description: PDF generated successfully.
 *       "404":
 *         description: Resume not found.
 *       "500":
 *         description: Internal server error.
 */
router.post('/generate-pdf', resumeController.generatePdf);

// router.get('/:id', resumeController.getResumeById);
/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: Get all resumes
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: A list of resumes.
 *       "500":
 *         description: Internal server error.
 */
router.get('/', resumeController.getResumes);

module.exports = router;