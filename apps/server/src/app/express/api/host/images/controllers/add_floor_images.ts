import { Response, Request } from "express";
import uploadImagesMulter from "../services.ts/mutlerSetUp";
import multer from "multer";
import CompanyModel from "../../../../../mongo/assets/companyModel";

export const uploadAndUpdateFloorImages = async (
  req: Request,
  res: Response,
) => {
  const { company_id, floor_number } = req.params;
  try {
    const uploadedImages = await uploadBuildingImages(req, res, company_id);
    const updateAssetWithImages = await updateCompanyFloor(
      company_id,
      floor_number,
      uploadedImages,
    );

    return res.status(200).json({
      msg: "uploaded and updated with Success",
      data: updateAssetWithImages,
    });
  } catch (error) {
    console.log("internalError", error);
    res.status(500).json({ msg: "not able to add and update Floor Images" });
  }
};

const uploadBuildingImages = async (
  req: Request,
  res: Response,
  company_id,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    try {
      const imagesURL: string[] = [];

      const assetMulterLoad = uploadImagesMulter("company", company_id, 3);

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

            console.log("floor Images", imagesURL);
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

const updateCompanyFloor = async (
  company_id: string,
  floor_number: string,
  photoURLs: string[],
) => {
  try {
    const companyModel = CompanyModel();
    console.log("company_id", company_id);
    console.log("floor", floor_number);

    const updatedFloorResult = await companyModel.findOneAndUpdate(
      { _id: company_id, "floor.floorNumber": floor_number },
      { $addToSet: { "floor.$.floorMap": { $each: photoURLs } } },
      { new: true },
    );

    console.log("final reulsts ", updatedFloorResult);

    return updatedFloorResult;
  } catch (error) {
    console.log("Error updating asset with images", error);
    throw error; // Rethrow the error to be caught by the outer catch block
  }
};
