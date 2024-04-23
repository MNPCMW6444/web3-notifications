import { getModel } from "../";
import { ErrorLog } from "@w3notif/shared";

export default () =>
  getModel<ErrorLog>("errorLog", {
    stringifiedError: {
      type: String,
    },
  });
