import { Router } from "express";
import { AuthenticatedRequest } from "../../middleware";
import {
  MIN_PASSWORD_STRENGTH,
  PassResetFinReq,
  PassResetReqReq,
  TODO,
  UpdatePasswordReq,
} from "@w3notif/shared";
import userModel from "../../../mongo/auth/userModel";
import { v4 } from "uuid";
import settings from "../../../../config";
import { resetPassword } from "../../../../content/email-templates/auth";
import { sendEmail } from "../../../email/sendEmail";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import passResetRequestModel from "../../../mongo/auth/passResetRequestModel";
import PassResetRequestModel from "../../../mongo/auth/passResetRequestModel";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const router = Router();

router.post<PassResetReqReq, string>(
  "/passresetreq",
  async (req, res, next) => {
    try {
      const PassResetRequest = passResetRequestModel();

      const { email, client } = req.body as PassResetReqReq;
      if (!email || !client)
        return res.status(400).send("email and client are required");

      const user = await userModel().findOne({ email });
      if (!user || user.type === "admin")
        return res.status(400).send("No host or guest found with this email");

      const key = v4();
      await new PassResetRequest({
        email,
        key,
      }).save();

      const url = `${client === "guest" ? settings.clientDomains.guest : client === "host" ? settings.clientDomains.host : settings.clientDomains.admin}/?rescode=${key}`;

      const { subject, body } = resetPassword(url);
      sendEmail(email, subject, body).then(
        () =>
          settings.whiteEnv === "local" &&
          console.log("tried to send pass reset email - link is: " + url),
      );
      return res.status(200).send("email sent successfully");
    } catch (error) {
      next(error);
    }
  },
);

router.post<PassResetFinReq, string>(
  "/passresetfin",
  async (req, res, next) => {
    try {
      const User = userModel();
      const PassResetRequest = PassResetRequestModel();
      const { key, password, passwordAgain } = req.body as PassResetFinReq;
      if (!key || !password || !passwordAgain)
        return res
          .status(400)
          .send("key, password, passwordAgain and type are required");

      const passwordStrength = zxcvbn(password);
      if (passwordStrength.score < MIN_PASSWORD_STRENGTH)
        return res.status(400).send("Password is too weak");

      if (password !== passwordAgain)
        return res.status(400).send("Passwords don't match");

      const exisitngPassResetRequest = await PassResetRequest.findOne({
        key,
      });
      if (!exisitngPassResetRequest) {
        return res.status(400).send("Wrong key");
      }

      const existingUser = await User.findOne({
        email: exisitngPassResetRequest.email,
      });

      const salt = await bcrypt.genSalt();
      existingUser.passwordHash = await bcrypt.hash(password, salt);

      await existingUser.save();

      const token = jsonwebtoken.sign(
        {
          id: existingUser._id,
        },
        settings.jwtSecret,
      );

      return res
        .cookie("jwt", token, {
          httpOnly: true,
          sameSite:
            settings.nodeEnv === "development"
              ? "lax"
              : settings.nodeEnv === "production"
                ? "none"
                : "lax",
          secure:
            settings.nodeEnv === "development"
              ? false
              : settings.nodeEnv === "production" && true,
        })
        .send();
    } catch (error) {
      next(error);
    }
  },
);

router.put("/update-password", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Please Login");
    const { currentPassword, newPassword, newPasswordAgain } =
      req.body as UpdatePasswordReq;
    if (!currentPassword || !newPassword || !newPasswordAgain)
      return res
        .status(400)
        .send("currentPassword, newPassword and newPasswordAgain are required");

    const correctPassword = await bcrypt.compare(
      currentPassword,
      req.user.passwordHash,
    );
    if (!correctPassword) {
      return res.status(401).send("Wrong password");
    }

    const passwordStrength = zxcvbn(newPassword);
    if (passwordStrength.score < MIN_PASSWORD_STRENGTH)
      return res.status(400).send("Password is too weak");

    if (newPassword !== newPasswordAgain)
      return res.status(400).send("Passwords don't match");

    const salt = await bcrypt.genSalt();
    req.user.passwordHash = await bcrypt.hash(newPassword, salt);

    await req.user.save();

    return res.status(201).send("Password successfully updated");
  } catch (error) {
    next(error);
  }
});

router.put("/update-phone", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Please Login");
    const { phone } = req.body;
    if (!phone) return res.status(400).send("phone is required");

    req.user.phone = phone;

    await req.user.save();

    return res.status(201).send("Phone successfully updated");
  } catch (error) {
    next(error);
  }
});

router.put("/update-name", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("Please Login");
    const { name } = req.body;
    if (!name) return res.status(400).send("name is required");

    req.user.name = name;

    await req.user.save();

    return res.status(201).send("Name successfully updated");
  } catch (error) {
    next(error);
  }
});

const upload = multer({ storage: multer.memoryStorage() });

export const bucketName =
  settings.whiteEnv === "prod"
    ? "w3notif-prod-images"
    : "w3notif-preprod-images";

router.put(
  "/update-profile-picture",
  upload.single("file"),
  async (req: TODO, res, next) => {
    try {
      if (!req.user) return res.status(401).send("Please Login");
      if (!req.file) return res.status(400).send("No file received");

      const userId = req.user._id.toString(); // Assuming _id is available and toString() is valid
      const originalKey = `user/${userId}/profile-pictures/${req.file.originalname}`;
      const resizedKey = `user/${userId}/profile-pictures/128_${req.file.originalname}`;

      // Resize the image to 128 pixels width
      const resizedImageBuffer = await sharp(req.file.buffer)
        .resize(128)
        .toBuffer();

      // Upload the original image
      /*  await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: originalKey,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        }),
      );*/

      // Upload the resized image
      /*await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: resizedKey,
          Body: resizedImageBuffer,
          ContentType: req.file.mimetype,
        }),
      );*/

      // Assuming you have a way to save the URL or key in your user model
      // For example, saving the key of the original image
      req.user.profilePictureUrlKey = originalKey;
      await req.user.save();

      res.status(201).send("Photo updated successfully");
    } catch (error) {
      next(error);
    }
  },
);

export default router;
