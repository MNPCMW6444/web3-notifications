import { Data } from "@w3notif/shared";
import twilio from "twilio";

export const sendSMS = (min: number, val: number, userSecrets: Data) => {
  const sid = userSecrets.secrets.twilio_sid;
  const auth = userSecrets.secrets.twilio_secret;
  const number = userSecrets.secrets.twilio_Number;
  const receiver = userSecrets.secrets.twilio_Receiver;

  if (sid && auth && number && receiver) {
    const client = twilio(sid, auth);

    client.messages
      .create({
        body: "new Value: " + val + ", this is more than " + min,
        from: "+" + number,
        to: "+" + receiver,
      })
      .then((message) => console.log(message.sid));
  }
};
export const sendEmail = (min: number, val: number, userSecrets: Data) => {};
export const sendPush = (min: number, val: number, userSecrets: Data) => {};
