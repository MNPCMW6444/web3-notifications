import { getModel } from "../";
import { NotificationRule, Rules } from "@w3notif/shared";

export default () =>
  getModel<NotificationRule>("notificationRule", {
    userId: { type: String },
    key: {
      type: String,
      enum: [...Object.keys(Rules)],
    },
    push: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: false,
    },
    sms: {
      type: Boolean,
      default: false,
    },
  });
