const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment management
 */

// All user routes are protected by the auth middleware
router.use(authMiddleware);

/**
 * @swagger
 * /payment/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session for subscription
 *     tags: [Payment]
 */

router.post('/create-checkout-session', paymentController.createCheckoutSession);

module.exports = router;