const httpStatus = require('http-status-codes');
const User = require('../models/user.model');
const asyncHandler = require('../../utils/asyncHandler');
const Stripe = require('stripe');
const ApiResponse = require('../../utils/ApiResponse');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { priceId, successUrl, cancelUrl } = req.body;
  const user = req.user; // from auth middleware

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: user.stripeCustomerId || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: user._id.toString(),
    }
  });
  console.log("Created Stripe Checkout Session:", session);
  // if it's first time create customer
  if (!user.stripeCustomerId) {
    // retrieve session.customer
    await User.findByIdAndUpdate(user._id, { stripeCustomerId: session.customer });
  }

  res.json(new ApiResponse(httpStatus.OK, { url: session.url }));
});

module.exports = {
  createCheckoutSession,
};
