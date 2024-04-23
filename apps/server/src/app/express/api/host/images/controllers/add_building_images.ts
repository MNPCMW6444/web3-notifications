import { Response, Request } from "express";
import uploadImagesMulter from "../services.ts/mutlerSetUp";
import multer from "multer";
import BuildingModel from "../../../../../mongo/assets/buildingModel";

export const uploadAndUpdateBuildingImage = async (
  req: Request,
  res: Response,
) => {
  const { building_id } = req.params;
  try {
    const uploadedImages = await uploadBuildingImages(req, res, building_id);
    const updateAssetWithImages = await updateAsset(
      building_id,
      uploadedImages,
    );

    return res.status(200).json({
      msg: "uploaded and updated with Success",
      data: updateAssetWithImages,
    });
  } catch (error) {
    console.log("internalError", error);
    res.status(500).json({ msg: "not able to add and update asset Images" });
  }
};

const uploadBuildingImages = async (
  req: Request,
  res: Response,
  building_id,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    try {
      const imagesURL: string[] = [];

      const assetMulterLoad = uploadImagesMulter("building", building_id, 3);

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

            console.log("buildiong Images", imagesURL);
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

const updateAsset = async (building_id: string, photoURLs: string[]) => {
  try {
    const buildingModel = BuildingModel();

    const updatedBuildingResult = await buildingModel.findOneAndUpdate(
      { _id: building_id },
      { $addToSet: { buildingImages: { $each: photoURLs } } },
      { new: true },
    );

    console.log(updatedBuildingResult);

    return updatedBuildingResult;
  } catch (error) {
    console.log("Error updating asset with images", error);
    throw error; // Rethrow the error to be caught by the outer catch block
  }
};
