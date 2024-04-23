import { getModel } from "..";
import { Conversation } from "@w3notif/shared";

export default () =>
  getModel<Conversation>("conversation", {
    hostId: {
      type: String,
    },
    guestId: {
      type: String,
    },
    hiddenFor: [{ type: String }],
  });
