import stripe from "stripe";
import settings from "../../config";

let stripeInstance: stripe;
try {
  stripeInstance = new stripe(settings.stripeApiKey);
} catch (e) {
  console.log("problem with stripe api key");
}

export const createHostAccount = async (
  prefill: stripe.AccountCreateParams = {},
) => {
  try {
    return await stripeInstance.accounts.create({
      ...prefill,
      type: "express",
    });
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const createHostAccountLink = async (hostAccountId: string) => {
  try {
    return await stripeInstance.accountLinks.create({
      account: hostAccountId,
      refresh_url: settings.clientDomains.host + "/stripe/reauth",
      return_url: settings.clientDomains.host + "/stripe/return",
      type: "account_onboarding",
    });
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const createBookingSession = async (
  line_items: { price: string; quantity: number }[] = [],
  hostAccountId: string,
) => {
  try {
    return await stripeInstance.checkout.sessions.create({
      mode: "payment",
      line_items,
      payment_intent_data: {
        application_fee_amount: 100000,
        transfer_data: {
          destination: hostAccountId,
        },
      },
      success_url: settings.clientDomains.guest + "/stripe/checkout_suc",
      cancel_url: settings.clientDomains.guest + "/stripe/checkout_ret",
    });
  } catch (e) {
    console.log(e);
  }
  return null;
};
