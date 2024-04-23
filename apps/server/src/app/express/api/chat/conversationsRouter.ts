import { Router } from "express";
import { AuthenticatedRequest } from "../../middleware";
import conversationModel from "../../../mongo/chats/conversationModel";
import {
  getLastMessageOfConversation,
  getNameOfUser,
  getNumberOfUnreadMessagesInConversation,
} from "./index";
import { TODO, User } from "@w3notif/shared";
import bookingModel from "../../../mongo/bookings/bookingModel";
import userModel from "../../../mongo/auth/userModel";
import assetModel from "../../../mongo/assets/assetModel";
import companyModel from "../../../mongo/assets/companyModel";

const router = Router();

router.get("/:quantity?", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Please Log In First");
    let quantity = parseInt(req.params.quantity);
    if (isNaN(quantity) || quantity < 1) {
      quantity = undefined;
    }
    let query = conversationModel().find({
      $or: [
        { hostId: req.user._id.toString() },
        { guestId: req.user._id.toString() },
      ],
    });
    if (quantity) {
      query = query.limit(quantity);
    }
    const conversations = await query;
    return res.status(200).json(
      await Promise.all(
        conversations.map(async (c: TODO) => ({
          ...c.toObject(),
          lastMessage: await getLastMessageOfConversation(c._id.toString()),
          name: await getNameOfUser(
            req.user.type === "guest" ? c.hostId : c.guestId,
          ),
          unReadNumber: await getNumberOfUnreadMessagesInConversation(
            c._id.toString(),
            req.user,
          ),
        })),
      ),
    );
  } catch (e) {
    next(e);
  }
});

router.get(
  "/idByBookingId/:id",
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) return res.status(401).send("Please log in");
      if (!req.params.id) return res.status(400).send("No Id received");
      const User = userModel();
      const booking = await bookingModel().findById(req.params.id);
      const user =
        req.user.type === "host"
          ? await User.findById(booking.guest)
          : await User.findById(
              (
                await companyModel().findById(
                  (
                    await assetModel().findById(
                      booking ? booking.asset : req.params.id,
                    )
                  ).companyId,
                )
              ).host,
            );
      const ress = await conversationModel().findOne({
        $or: [
          { guestId: user._id.toString() },
          { hostId: user._id.toString() },
        ],
      });
      if (ress) return res.status(200).json(ress);
      if (!user?._id?.toString())
        return res.status(404).send("No partner found");
      return res.status(201).send(user._id.toString());
    } catch (e) {
      next(e);
    }
  },
);

export default router;
