import { Message, Rule, Rules } from "@w3notif/shared";
import messageModel from "../mongo/chats/messageModel";
import PubSub from "pubsub-js";
import { Types } from "mongoose";
import userModel from "../mongo/auth/userModel";
import settings from "../../config";
import { newMessage } from "../../content/email-templates/notifications";
import notificationRuleModel from "../mongo/notifications/notificationRuleModel";
import { sendPushNotification } from "../push";
import pushDeviceModel from "../mongo/notifications/pushDeviceModel";
import { sendEmail } from "../email/sendEmail";
import conversationModel from "../mongo/chats/conversationModel";

export default () =>
  messageModel()
    .watch()
    .on(
      "change",
      async (data: {
        _id: {
          _data: string;
        };
        operationType: "insert" | "update" | string;
        clusterTime: { $timestamp: number };
        wallTime: Date;
        fullDocument: Message;
        ns: { db: "w3notif"; coll: "messages" };
        documentKey: { _id: Types.ObjectId };
      }) => {
        try {
          PubSub.publish("chats", JSON.stringify(data.clusterTime));
          const User = userModel();
          if (data.operationType === "insert") {
            const sender = await User.findById(data?.fullDocument?.ownerId);
            const conv = await conversationModel().findById(
              data?.fullDocument?.conversationId,
            );
            const recepient = await User.findById(
              data?.fullDocument?.ownerId === conv.guestId
                ? conv.hostId
                : conv.guestId,
            );
            const domain =
              sender?.type === "host"
                ? settings.clientDomains.guest
                : settings.clientDomains.host;
            const rule: Rule<{
              conversationId: string;
              domain: string;
            }> = {
              key: Rules.ChatEvent,
              push: {
                payload: {
                  title: sender?.name || "",
                  body: data?.fullDocument?.message,
                },
                data: {
                  domain,
                  conversationId: data?.fullDocument?.conversationId,
                },
              },
              email: {
                ...newMessage(
                  sender?.name || "",
                  data?.fullDocument?.message,
                  domain + "/chats",
                ),
              },
              sms: {
                message:
                  "New Message from " +
                  sender?.name +
                  " go to " +
                  settings.clientDomains +
                  "/chats" +
                  " to read and repley",
              },
            };
            notificationRuleModel()
              .find()
              .then((subscriptions) =>
                Promise.all(
                  subscriptions.map(async (subscription) => {
                    if (
                      Rules[
                        subscription.key as unknown as keyof typeof Rules
                      ] === rule.key
                    ) {
                      subscription.push &&
                        recepient._id.toString() === subscription.userId &&
                        (
                          await pushDeviceModel().find({
                            userId: subscription.userId,
                          })
                        ).forEach((device) =>
                          sendPushNotification(
                            device.subscription,
                            rule.push.payload,
                            rule.push.data,
                          ),
                        );
                      subscription?.email &&
                        recepient._id.toString() === subscription.userId &&
                        sendEmail(
                          (await User.findById(subscription.userId))?.email ||
                            "",
                          rule.email.subject,
                          rule.email.html,
                        );
                      /* (subscription.sms) && recepient._id.toString() === subscription.userId &&
                       sendSMS();*/
                    }
                  }),
                ),
              )
              .then(() => {
                console.log("All notifications processed successfully.");
              })
              .catch((error) => {
                console.log(
                  "An error occurred while processing notifications:",
                  error,
                );
              });
          }
        } catch (e) {
          console.log("error on new message side effects: ", e);
        }
      },
    );
