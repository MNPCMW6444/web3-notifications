/*
import stripeEventModel from "../mongo/stripe/stripeEventModel";
*/

export const webhookHandler = async (event) => {
  /* new (stripeEventModel())({ stringifiedEvent: JSON.stringify(event) }).save;*/
  console.log("stripe event logged");
};
