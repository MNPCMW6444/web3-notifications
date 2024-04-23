import { Response, Request } from "express";
import multer from "multer";
import AssetModel from "../../../../../mongo/assets/assetModel";
import uploadImagesMulter from "../services.ts/mutlerSetUp";

export const uploadAndUpdateAssetImages = async (
  req: Request,
  res: Response,
) => {
  const asset_id = req.params.asset_id;
  try {
    const uploadedImages = await uploadAssetImages(req, res, asset_id);
    const updateAssetWithImages = await updateAsset(asset_id, uploadedImages);

    return res.status(200).json({
      msg: "uploaded and updated with Success",
      data: updateAssetWithImages,
    });
  } catch (error) {
    console.log("internalError", error);
    res.status(500).json({ msg: "not able to add and update asset Images" });
  }
};

const uploadAssetImages = async (
  req: Request,
  res: Response,
  asset_id,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    try {
      const imagesURL: string[] = [];

      const assetMulterLoad = uploadImagesMulter("/assets", asset_id, 6);

      assetMulterLoad(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          reject(err.message);
        } else {
          if (req.files === undefined || req.files.length === 0) {
            reject("Error: No File Selected");
          } else {
            const fileArray: any = req.files;

            if (fileArray.length >= 1) {
              for (let i = 0; i < fileArray.length; i++) {
                const fileKey = fileArray[i].key;
                imagesURL.push(fileKey);
              }
            }

            console.log("the arr ay ", imagesURL);
            resolve(imagesURL);
          }
        }
      });
    } catch (error) {
      console.log("Error during image upload", error);
      reject(error);
    }
  });
};

const updateAsset = async (asset_id: string, photoURLs: string[]) => {
  try {
    const assetModel = AssetModel();

    const updateAssetResult = await assetModel.findOneAndUpdate(
      { _id: asset_id },
      { $addToSet: { photos: { $each: photoURLs } } },
      { new: true },
    );

    console.log(updateAssetResult);

    return updateAssetResult;
  } catch (error) {
    console.log("Error updating asset with images", error);
    throw error; // Rethrow the error to be caught by the outer catch block
  }
};
