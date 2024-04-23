import webpush from "web-push";
import settings from "../../config";
import { TODO } from "@w3notif/shared";

const vapidKeys = {
  publicKey:
    "BOFhGIZEMgip3Nta9OfW7PjaCHzCqmK0PCOsJFamzutLksarYGf2kJse3RxEhddHdTGUFzE7fRXw9mNAWmE0E5w",
  privateKey: settings.push,
};

webpush.setVapidDetails(
  "mailto:michael@w3notif.com",
  vapidKeys.publicKey,
  "7UiX-B_GyBRfefQetozSnaRoT84Rt0BC0gR26v3RGyg" ||
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
