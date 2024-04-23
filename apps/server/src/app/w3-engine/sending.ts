import { Data } from "@w3notif/shared";
import twilio from "twilio";

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
export const sendEmail = (min: number, val: number, userSecrets: any) => {};
export const sendPush = (min: number, val: number, userSecrets: any) => {};
