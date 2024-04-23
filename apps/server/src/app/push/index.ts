import webpush from "web-push";
import settings from "../../config";
import { TODO } from "@w3notif/shared";

const vapidKeys = {
  publicKey:
    "BH1R9v3i49K6RwINhRAIGDWeD5Qc4P8goayR9Zse5GHr8P6TftjYECx98M-C7YBpA-DPbnM_k_QdZgQc5QnWgU8",
  privateKey: settings.push,
};

webpush.setVapidDetails(
  "mailto:michael@w3notif.com",
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
