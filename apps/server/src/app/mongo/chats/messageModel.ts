import { getModel } from "..";
import { Message } from "@w3notif/shared";

export default () =>
  getModel<Message>("message", {
    ownerId: {
      type: String,
    },
    conversationId: { type: String },
    message: {
      type: String,
    },
    whenQueried: Number,
    whenMarked: Number,
  });
