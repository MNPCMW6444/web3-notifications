import { getModel } from "..";
import { User } from "@w3notif/shared";

export default () =>
  getModel<User>("user", {
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: false,
    },
    passwordHash: { type: String },
    name: {
      type: String,
    },
    fname: {
      type: String,
    },
    lname: {
      type: String,
    },
    type: {
      type: String,
      enum: ["admin", "host", "guest"],
    },
    profilePictureUrlKey: String,
  });
