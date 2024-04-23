import {Router} from "express";
import {AddBuilding, createBuildingId} from "./controllers/add_building";
import {
  getBuildingList,
  getBuildingDetail,
} from "./controllers/read_building";
import {deleteBuilding} from "./controllers/delete_building";
import {editBuilding} from "./controllers/edit_building";

const buildingRouter = Router();

// BuildingRouters
buildingRouter.post("/get_building_id", createBuildingId);
buildingRouter.put("/add_building", AddBuilding);
buildingRouter.get("/get_buildings_list", getBuildingList);
buildingRouter.get("/get_building/:building_id", getBuildingDetail);
buildingRouter.put("/edit_building/:building_id", editBuilding);
buildingRouter.delete("/delete_building/:building_id", deleteBuilding);

export default buildingRouter;
