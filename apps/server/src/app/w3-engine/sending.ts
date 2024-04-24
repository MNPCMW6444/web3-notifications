import twilio from "twilio";
import { sendPushNotification } from "../push";
import { sendEmail as sm } from "../email/sendEmail";

export const sendSMS = (min: number, val: number, userSecrets) => {
  const sid = (userSecrets as any).twilio_sid;
  const auth = (userSecrets as any).twilio_secret;
  const number = (userSecrets as any).twilio_Number;
  const receiver = (userSecrets as any).twilio_Receiver;

  if (sid && auth && number && receiver) {
    const client = twilio(sid, auth);

    client.messages
      .create({
        body: "new Value: " + val + ", this is more than " + min,
        from: "+" + number,
        to: "+" + receiver,
      })
      .then((message) => console.log(message.sid));
  } else console.log("Tryied but no data good");
};
export const sendEmail = (min: number, val: number, userSecrets: any) => {
  sm(
    "benji5337831@gmail.com",
    "Web3 Notification",
    "value is " + val + ", more than " + min,
  ).then((x) => console.log(x));
};
export const sendPush = (min: number, val: number, userSecrets: any) => {
  const devices = userSecrets.stringified_Devices;

  devices.forEach((device) => {
    const d = JSON.parse(device);

    sendPushNotification(
      d.subscription,
      {
        title: "Cap is lifted!",
        body: "from " + min + " to " + val,
      },
      {
        domain: "",
      },
    );
  });
};
