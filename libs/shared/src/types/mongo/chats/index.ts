import { Document } from "mongoose";

export interface Conversation extends Document {
  hostId: string;
  guestId: string;
  name: string;
  hiddenFor?: string[];
  lastMessage?: Message;
  unReadNumber: number;
}

export interface Message extends Document {
  ownerId: string;
  conversationId: string;
  message: string;
  whenQueried?: number;
  whenMarked?: number;
  createdAt: string;
  updatedAt: string;
}
