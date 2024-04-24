import webpush from "web-push";
import settings from "../../config";
import { TODO } from "@w3notif/shared";

const vapidKeys = {
  publicKey:
    "BJN3ex816a0jUOWGBQNEZP9jJn6oehivZB4XCSoIXdIVUUqu5o4MOZG5m2ZshFGU89puqpjPpt6Qs3BEQ8aTsQU",
  privateKey: settings.push,
};

webpush.setVapidDetails(
  "mailto:michael@w3notif.com",
  vapidKeys.publicKey,
  settings.push ||
    (() => {
      throw new Error("No private key set");
    })(),
);

export const sendPushNotification = async <D extends { domain: string }>(
  subscription: TODO,
  payload: { title: string; body: string },
  data: D,
) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ ...payload, ...data }),
    );
    console.log("Notification sent successfully.");
  } catch (error) {
    console.log("Error sending notification:", error);
  }
};
