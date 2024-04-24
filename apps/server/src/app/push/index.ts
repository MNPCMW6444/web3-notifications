import webpush from "web-push";
import settings from "../../config";
import { TODO } from "@w3notif/shared";

const vapidKeys = {
  publicKey:
    "BEhM-6eY91zTcC0-5VcaGupEgXGCPKZfP1zZw-Tt7wFIf5EjjEO1tp27cTIxpXhMSZK98bHgD4STfGaqVerAlmc",
  privateKey: settings.push,
};

webpush.setVapidDetails(
  "mailto:michael@offisito.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey ||
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
