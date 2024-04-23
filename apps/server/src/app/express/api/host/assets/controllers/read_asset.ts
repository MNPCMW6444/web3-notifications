import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middleware";
import AssetModel from "../../../../../mongo/assets/assetModel";
import CompanyModel from "../../../../../mongo/assets/companyModel";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { bucketName } from "../../../auth/manageRouter";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../../../../s3";

export const signUrls = async (arr: string[]): Promise<string[]> => {
  const signedUrls = await Promise.all(
    arr.map(async (key) => {
      const checkKey = "cropped-" + key;
      try {
        await s3Client.send(
          new HeadObjectCommand({
            Bucket: bucketName,
            Key: checkKey,
          }),
        );
        // If exists, proceed to sign the "cropped-" prefixed key
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: checkKey,
        });
        return getSignedUrl(s3Client, command, {
          expiresIn: 1800,
        });
      } catch (error) {
        // If the object does not exist, check the error code to be sure
        if (error.name === "NotFound") {
          // Object doesn't exist, sign URL for the original key
          const originalCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
          });
          return getSignedUrl(s3Client, originalCommand, {
            expiresIn: 1800,
          });
        } else {
          // For any other errors, rethrow them
          throw error;
        }
      }
    }),
  );
  return signedUrls;
};

export const getAssetDetail = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const assetModel = AssetModel();

  try {
    const asset_id = req.params.asset_id;

    const findAsset = (await assetModel.findById({ _id: asset_id })).toObject();

    if (!findAsset) return res.status(400).send("Not Valid ASSET ID");

    if (findAsset.photos?.length > 0)
      findAsset.photoURLs = await signUrls(findAsset.photos);

    return res.status(200).json(findAsset);
  } catch (error) {
    next(error);
  }
};

export const getAssetsList = async (
  req: AuthenticatedRequest,
  res: Response,
  next,
) => {
  const assetModel = AssetModel();
  const companyModel = CompanyModel();
  const authenticatedHost = req.user;

  try {
    const hostscompanies = await companyModel.find({
      host: authenticatedHost._id,
    });
    const assetList =
      hostscompanies.length === 0
        ? hostscompanies
        : await assetModel.find({
            $or: hostscompanies.map(({ _id }) => ({ companyId: _id })),
          });

    //console.log("count", assetList.length);

    if (!assetList) return res.status(400).send("There are no Assets Yet");
    else {
      return res.status(200).send(assetList);
    }
  } catch (error) {
    next(error);
  }
};
