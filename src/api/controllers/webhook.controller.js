const User = require('../models/user.model');
const asyncHandler = require('../../utils/asyncHandler');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function updateUserPlan(userId, plan, resumeLimit) {
  // Find the user in your database
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Update the user's plan and resume limit
  user.plan = plan;
  user.resumeLimit = resumeLimit;

  await user.save();
}


const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.metadata.userId;
        const subscriptionId = session.subscription;

        // Get subscription details to determine the plan
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        // Update user's plan and resume limit in your database based on priceId
        if (priceId === process.env.STRIPE_BASIC_PRICE_ID) {
          await updateUserPlan(userId, 'basic', 5);
        } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          await updateUserPlan(userId, 'pro', 10);
        }

        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscriptionData = event.data.object;
        const userSubId = subscriptionData.metadata.userId;

        if (subscriptionData.status === 'active') {
          const subscription = await stripe.subscriptions.retrieve(subscriptionData.id);
          const priceId = subscription.items.data[0].price.id;

          if (priceId === process.env.STRIPE_BASIC_PRICE_ID) {
            await updateUserPlan(userSubId, 'basic', 5);
          } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
            await updateUserPlan(userSubId, 'pro', 10);
          }
        } else {
          // Downgrade or cancel user's plan
          await updateUserPlan(userSubId, 'free', 2);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = {
  handleStripeWebhook,
};
