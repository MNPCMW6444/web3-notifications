import {Document} from "mongoose";

export interface ErrorLog extends Document {
  stringifiedError: string;
}
