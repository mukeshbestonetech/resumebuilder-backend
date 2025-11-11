const express = require('express');
const webhookController = require('../controllers/webhook.controller');

const router = express.Router();

router.post('/stripe-webhook', webhookController.handleStripeWebhook);

module.exports = router;