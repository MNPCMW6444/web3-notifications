import { Response, Router } from "express";
import conversationsRouter from "./conversationsRouter";
import messagesRouter from "./messagesRouter";
import messageModel from "../../../mongo/chats/messageModel";
import userModel from "../../../mongo/auth/userModel";
import { Message, User } from "@w3notif/shared";
import PubSub from "pubsub-js";
import { AuthenticatedRequest } from "../../middleware";

const router = Router();

router.use("/conversations", conversationsRouter);
router.use("/messages", messagesRouter);
router.get("/subscribe", (req: AuthenticatedRequest, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const token = PubSub.subscribe("chats", (_, data) =>
    res.write(`data: ${JSON.stringify({ message: data })}\n\n`),
  );

  req.on("close", () => {
    PubSub.unsubscribe(token);
  });
});

export const getLastMessageOfConversation = async (conversationId: string) =>
  await messageModel()
    .findOne({ conversationId })
    .sort({ createdAt: -1 })
    .exec();

export const getNameOfUser = async (userId: string) =>
  (await userModel().findById(userId))?.name;

export const markMessagesAsRead = async (
  messages: Message[],
  user: User,
  level: "queried" | "marked",
) =>
  messages
    .filter(
      level === "queried"
        ? ({ whenQueried, ownerId }) =>
            user._id.toString() !== ownerId && !whenQueried
        : ({ whenMarked, ownerId }) =>
            user._id.toString() !== ownerId && !whenMarked,
    )
    .forEach((message) => {
      if (level === "queried") message.whenQueried = Date.now();
      else message.whenMarked = Date.now();
      message.save();
    });

export const getNumberOfUnreadMessagesInConversation = async (
  conversationId: string,
  user: User,
) =>
  (
    await messageModel().find({
      conversationId,
    })
  ).filter(
    ({ ownerId, whenQueried }) =>
      ownerId !== user._id.toString() && !whenQueried,
  ).length;

export default router;
