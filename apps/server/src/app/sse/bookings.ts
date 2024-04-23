import { Booking, RequestStatus, Rule, Rules } from "@w3notif/shared";
import PubSub from "pubsub-js";
import { Types } from "mongoose";
import userModel from "../mongo/auth/userModel";
import settings from "../../config";
import { newBooking } from "../../content/email-templates/notifications";
import notificationRuleModel from "../mongo/notifications/notificationRuleModel";
import { sendPushNotification } from "../push";
import pushDeviceModel from "../mongo/notifications/pushDeviceModel";
import { sendEmail } from "../email/sendEmail";
import bookingModel from "../mongo/bookings/bookingModel";

export default () =>
  bookingModel()
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
        fullDocument: Booking;
        ns: { db: "w3notif"; coll: "bookings" };
        documentKey: { _id: Types.ObjectId };
      }) => {
        try {
          PubSub.publish("bookings", JSON.stringify(data.clusterTime));
          const User = userModel();
          if (data?.fullDocument?.requestStatus === RequestStatus.Offer) {
            const guestThatSent = await User.findById(
              data?.fullDocument?.guest.toString(),
            );
            const rule: Rule<null> = {
              key: Rules.ChatEvent,
              push: {
                payload: {
                  title: guestThatSent?.name || "",
                  body:
                    "New booking request" + data?.fullDocument?.note
                      ? ": " + data?.fullDocument?.note
                      : "",
                },
                data: null,
              },
              email: {
                ...newBooking(
                  guestThatSent?.name || "",
                  data?.fullDocument?.note || "",
                  settings.clientDomains.host,
                ),
              },
              sms: {
                message:
                  "New Message from " + guestThatSent?.name ||
                  "" +
                    " go to " +
                    settings.clientDomains.host +
                    "/dashboard" +
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
                        (
                          await pushDeviceModel().find({
                            userId: subscription.userId,
                          })
                        ).forEach((device) =>
                          sendPushNotification(
                            device.subscription,
                            rule?.push?.payload,
                            rule?.push?.data,
                          ),
                        );
                      subscription.email &&
                        sendEmail(
                          (await User.findById(subscription.userId))?.email ||
                            "",
                          rule?.email?.subject,
                          rule?.email?.html,
                        );
                      /* (subscription.email) &&
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
