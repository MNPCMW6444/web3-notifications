import { S3Client } from "@aws-sdk/client-s3";
import settings from "../../config";

export const s3Client = new S3Client({
  region: settings.aws.region,
  credentials: {
    accessKeyId: settings.aws.keyID,
    secretAccessKey: settings.aws.secretKey,
  },
});
