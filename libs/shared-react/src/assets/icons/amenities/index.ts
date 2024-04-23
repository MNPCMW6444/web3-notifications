import {TODO} from "@w3notif/shared";
import Kitchen from "./Kitchen.png";
import Lounge from "./Lounge.png";
import Parking from "./Parking.png";
import PC from "./PC.png";
import Restaurants from "./Restaurants.png";
import WiFi from "./WiFi.png";


export const getAmenityIcon = (name: string) => {
  const map: TODO = {
    Kitchen, Lounge, Parking,
    PC,
    Restaurants,
    WiFi,
  }
  return map[name]
}
