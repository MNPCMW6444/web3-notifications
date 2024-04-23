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
    data: {
      secrets: {
        twilio_sid: String,
        twilio_service: String,
        twilio_secret: String,
        twilio_Number: Number,
        twilio_Sender: String,
        twilio_Receiver: Number,
        sendgrid_API: String,
        sendgrid_Address: String,
        interval_inseconds: { type: Number, required: true },
        loop: { type: String, enum: ["yes", "no"] },
        minimum: { type: Number, required: true },
        stringified_Devices: [String],
      },
    },
  });
