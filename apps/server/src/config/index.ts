import dotenv from "dotenv";
import process from "process";

interface Settings {
  nodeEnv: "development" | "production";
  mongoURI: string;
  jwtSecret: string;
  sendgridApiKey: string;
  clientDomains: {
    admin: string;
    host: string;
    guest: string;
  };
  whiteEnv: "local" | "preprod" | "prod";
  aws: {
    keyID: string;
    secretKey: string;
    region: string;
  };
  googleGeoCoding: string;
  stripeApiKey: string;
  push: string;
}

dotenv.config();

if (
  !(
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
  )
)
  throw new Error("NODE_ENV must be 'development' or 'production'");
if (
  !(
    process.env.WHITE_ENV === "local" ||
    process.env.WHITE_ENV === "preprod" ||
    process.env.WHITE_ENV === "prod"
  )
)
  throw new Error("WHITE_ENV must be 'local' or 'preprod' or 'prod'");

const settings: Settings = {
  ...(process.env.NODE_ENV === "production"
    ? {
        mongoURI: process.env.MONGO_URI || "",
        jwtSecret: process.env.JWT_SECRET || "",
        sendgridApiKey: process.env.SENDGRID || "",
        clientDomains:
          (process.env.WHITE_ENV || "prod") === "preprod"
            ? {
                guest: "https://preapp.w3notif.com",
                host: "https://prehost.w3notif.com",
                admin: "https://preadmin.w3notif.com",
              }
            : {
                guest: "https://app.w3notif.com",
                host: "https://host.w3notif.com",
                admin: "https://admin.w3notif.com",
              },
        whiteEnv: process.env.WHITE_ENV || "prod",
        aws: {
          keyID: process.env.AWS_KEY_ID || "",
          secretKey: process.env.AWS_SECRET_KEY || "",
          region: process.env.AWS_REGION || "",
        },
        googleGeoCoding: process.env.GOOGLE_GEO_CODING || "",
        stripeApiKey: process.env.STRIPE_API_KEY || "",
        push: process.env.PUSH || "",
      }
    : {
        mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/error",
        jwtSecret: process.env.JWT_SECRET || "xxxx",

        sendgridApiKey: process.env.SENDGRID || "",
        clientDomains: {
          guest: "http://localhost:4100",
          host: "http://localhost:4200",
          admin: "http://localhost:4300",
        },
        whiteEnv: process.env.WHITE_ENV || "preprod",
        aws: {
          keyID: process.env.AWS_KEY_ID || "",
          secretKey: process.env.AWS_SECRET_KEY || "",
          region: process.env.AWS_REGION || "",
        },
        googleGeoCoding: process.env.GOOGLE_GEO_CODING || "",
        stripeApiKey: process.env.STRIPE_API_KEY || "",
        push: process.env.PUSH || "",
      }),
  nodeEnv: process.env.NODE_ENV,
};

if (!settings) throw new Error("problem with NODE_ENV");

export default settings;
