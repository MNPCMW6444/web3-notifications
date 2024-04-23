//import { SES } from "@aws-sdk/client-ses";
import sendgrid from "@sendgrid/mail";
import settings from "../../config";

/*
const ses = new SES({
  region: settings.aws.region,

  credentials: {
    accessKeyId: settings.aws.keyID,
    secretAccessKey: settings.aws.secretKey,
  },
});*/

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    /*const params = {
      Source: `service@w3notif.com`,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
    };*/
    //const data = await ses.sendEmail(params);

    sendgrid.setApiKey(settings.sendgridApiKey);

    await sendgrid.send({
      to, // Change to your recipient
      from: "service@w3notif.com", // Change to your verified sender
      subject,
      html,
    });

    settings.whiteEnv === "local" &&
      console.log("Successfully sent email to " + to);
  } catch (error) {
    settings.whiteEnv !== "local" && console.log("Error sending email:", error);
  }
};
