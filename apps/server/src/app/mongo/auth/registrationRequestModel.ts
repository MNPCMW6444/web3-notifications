import { getModel } from "..";
import { RegistrationRequest } from "@w3notif/shared";

export default () =>
  getModel<RegistrationRequest>("registrationRequest", {
    email: {
      type: String,
    },
    key: {
      type: String,
    },
  });
