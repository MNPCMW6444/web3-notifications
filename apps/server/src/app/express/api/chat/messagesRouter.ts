import { Router } from "express";
import { AuthenticatedRequest } from "../../middleware";
import conversationModel from "../../../mongo/chats/conversationModel";
import messageModel from "../../../mongo/chats/messageModel";
import { SendMessageReq, User } from "@w3notif/shared";
import { markMessagesAsRead } from "./index";
import userModel from "../../../mongo/auth/userModel";
import companyModel from "../../../mongo/assets/companyModel";

const router = Router();

router.get(
  "/conversationMessages/:id",
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const Message = messageModel();
      const Conversation = conversationModel();
      const conversation = await Conversation.findById(req.params.id);
      if (
        req.user._id.toString() !== conversation.hostId &&
        req.user._id.toString() !== conversation.guestId
      )
        return res.status(401).send("You are not part of the conversation");
      const messages = await Message.find({
        conversationId: conversation._id.toString(),
      });
      markMessagesAsRead(messages, req.user, "queried");
      return res.status(200).json(messages);
    } catch (e) {
      next(e);
    }
  },
);

router.post("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    const { conversationIdOrAddressee, message } = req.body as SendMessageReq;
    const Message = messageModel();
    const Conversation = conversationModel();
    let conversation = await Conversation.findById(conversationIdOrAddressee);
    let hostId: User | string = await userModel().findById(
      conversationIdOrAddressee,
    );
    if (!hostId) {
      const company = await companyModel().findById(conversationIdOrAddressee);
      hostId = company?.host?.toString();
    } else hostId = (hostId as User)?._id?.toString();
    if (hostId && typeof hostId === "string") {
      conversation = await Conversation.findOne({
        hostId,
        guestId: req.user._id.toString(),
      });
    }
    if (!conversation?._id)
      conversation = await new Conversation({
        ...(req.user.type === "host"
          ? { hostId: req.user._id }
          : { guestId: req.user._id }),
        ...(req.user.type === "guest" ? { hostId } : { guestId: hostId }),
      }).save();
    console.log("req.user._id.toString(): ", req.user._id.toString());
    console.log("conversation: ", conversation);
    if (
      req.user._id.toString() !== conversation.hostId &&
      req.user._id.toString() !== conversation.guestId
    )
      return res.status(401).send("You are not part of the conversation");
    const newMessage = new Message({
      ownerId: req.user._id.toString(),
      conversationId: conversation._id,
      message,
    });

    await newMessage.save();

    return res.status(201).json("Message Sent");
  } catch (e) {
    next(e);
  }
});

export default router;
