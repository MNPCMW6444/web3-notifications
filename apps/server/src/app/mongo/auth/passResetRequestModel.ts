import { getModel } from "..";
import { PassResetRequest } from "@w3notif/shared";

export default () =>
  getModel<PassResetRequest>("passResetRequest", {
    email: {
      type: String,
    },
    key: {
      type: String,
    },
  });
