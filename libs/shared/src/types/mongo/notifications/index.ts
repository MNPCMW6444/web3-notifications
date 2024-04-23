import { Document } from "mongoose";
import { Rules } from "../..";

export interface PushDevice extends Document {
  userId: string;
  name: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

export interface NotificationRule extends Document {
  userId: string;
  key: Rules;
  push?: boolean;
  email?: boolean;
  sms?: boolean;
}
