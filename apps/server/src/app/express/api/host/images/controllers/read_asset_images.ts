import AssetModel from "../../../../../mongo/assets/assetModel";
import { Request, Response } from "express";
import { s3Client } from "../../../../../s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { bucketName } from "../services.ts/mutlerSetUp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// export const getAssetImageAws = async (req:Request, res:Response) => {

//     // concattinating the params as the url hold the fodler name/folder.
//     const image_key = req.params.key + req.params[0] ;

//     try{
//         const command = new GetObjectCommand({
//             Bucket: bucketName,
//             Key :image_key
//         });
//         try {
//             const signedUrl = await getSignedUrl(s3Client, command, {
//                 expiresIn: 3600,
//             });
//             res.status(200).send(signedUrl);
//         } catch (error) {
//            console.log("internal error")
//         }
//     }
//     catch(err){
//         console.log("Error fetching signed URL:", err);
//         res.status(500).send("Internal Server Error");

//     }
//     }

export const getAssetImageAws = async (imageURL) => {
  // concattinating the params as the url hold the fodler name/folder.
  const image_key = imageURL;

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: image_key,
    });
    const presignedURL = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return presignedURL;
  } catch (err) {
    console.log("Error fetching signed URL:", err);
    throw new Error("Unable to get Image");
  }
};
