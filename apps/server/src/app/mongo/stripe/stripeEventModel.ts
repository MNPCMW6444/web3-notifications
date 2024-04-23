import { getModel } from "../";
import { StripeEvent } from "@w3notif/shared";

export default () =>
  getModel<StripeEvent>("stripeEvent", {
    stringifiedEvent: { type: String, required: true },
  });
