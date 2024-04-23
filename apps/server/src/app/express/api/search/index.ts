import { Router } from "express";
import { AuthenticatedRequest } from "../../middleware";
import { Status, Query, Area } from "@w3notif/shared";
import assetModel from "../../../mongo/assets/assetModel";
import { getPointByAddress } from "../../../google-geocoding";
import { signUrls } from "../host/assets/controllers/read_asset";
import companyModel from "../../../mongo/assets/companyModel";
import userModel from "../../../mongo/auth/userModel";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { bucketName } from "../auth/manageRouter";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../../s3";

const router = Router();

router.get("/single/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.params.id) return res.status(400).send("No id received");
    const asset = (await assetModel().findById(req.params.id)).toObject();
    asset.photoURLs = await signUrls(asset.photos);
    return res.status(200).json(asset);
  } catch (e) {
    next(e);
  }
});

router.get(
  "/:stringifiedQuery",
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.params.stringifiedQuery)
        return res.status(400).send("No Query received");
      const { config, params }: Query = JSON.parse(req.params.stringifiedQuery);
      const query = {
        publishingStatus: Status.Active,
      };
      if (params.location) {
        const location = params.location as Area & {
          lat: number;
          long: number;
          address: string;
        };
        let { lat, long } = location;
        const { address, radius } = location;
        if (!lat) {
          const { lat: nlat, lng } = await getPointByAddress(address);
          lat = nlat;
          long = lng;
        }
        query["location"] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [long, lat],
            },
            $maxDistance: radius,
          },
        };
      }
      if (params.minPricePerMonth || params.maxPricePerMonth) {
        query["leaseCondition.monthlyPrice"] = {};
        if (params.minPricePerMonth) {
          query["leaseCondition.monthlyPrice"]["$gte"] =
            params.minPricePerMonth;
        }
        if (params.maxPricePerMonth) {
          query["leaseCondition.monthlyPrice"]["$lte"] =
            params.maxPricePerMonth;
        }
      }
      if (params.asset_type) {
        query["assetType"] = params.asset_type;
      }
      if (params.requiredAmenities && params.requiredAmenities.length > 0) {
        query["assetAmenities.name"] = { $all: params.requiredAmenities };
      }

      const limit = config.limit || 10;
      const skip = config.offset || 0;

      const assets = (
        await assetModel().find(query).limit(limit).skip(skip)
      ).map((r) => r.toObject());

      for (let i = 0; i < assets.length; i++)
        if (assets[i].photos?.length > 0)
          assets[i].photoURLs = await signUrls(assets[i].photos);
      return res.status(200).json(assets);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/hostData/:companyId",
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) return res.status(401).send("not looged in");
      if (!req.params.companyId) return res.status(400).send("no id received");
      const company = await companyModel().findById(req.params.companyId);
      const host = await userModel().findById(company.host);
      let pictureUrl = "";
      if (host.profilePictureUrlKey) {
        const imageSize = req.params.size as "128" | undefined;
        let key = req.user.profilePictureUrlKey;
        if (imageSize === "128") {
          key = key.replace(/(\/profile-pictures\/)/, `$1128_`);
        }
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        });
        const pictureUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 1800,
        });
      }
      return res.status(200).json({
        hostName: host.name,
        companyName: company.companyName,
        hostCreateDate: host.createdAt,
        pictureUrl,
      });
    } catch (e) {
      next(e);
    }
  },
);

export default router;
