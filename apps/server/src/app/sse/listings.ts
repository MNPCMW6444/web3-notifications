import PubSub from "pubsub-js";
import buildingModel from "../mongo/assets/buildingModel";
import companyContractModel from "../mongo/assets/companyModel";
import assetModel from "../mongo/assets/assetModel";
import bookingModel from "../mongo/bookings/bookingModel";
import amenityModel from "../mongo/amenities/amenityModel";

export default () => {
  buildingModel()
    .watch()
    .on("change", (data) => {
      PubSub.publish("listings", JSON.stringify(data.clusterTime));
    });
  companyContractModel()
    .watch()
    .on("change", (data) => {
      PubSub.publish("listings", JSON.stringify(data.clusterTime));
    });
  assetModel()
    .watch()
    .on("change", (data) => {
      PubSub.publish("listings", JSON.stringify(data.clusterTime));
    });
  bookingModel()
    .watch()
    .on("change", (data) => {
      PubSub.publish("listings", JSON.stringify(data.clusterTime));
    });
  amenityModel()
    .watch()
    .on("change", (data) => {
      PubSub.publish("listings", JSON.stringify(data.clusterTime));
    });
};
