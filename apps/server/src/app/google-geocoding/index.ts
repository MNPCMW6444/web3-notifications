import settings from "../../config";
import axios from "axios";

export const getAddressByPoint = async (
  lat: number,
  lng: number,
): Promise<string> => {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "," +
        lng +
        "&key=" +
        settings.googleGeoCoding,
    );
    return res.data.results[0].formatted_address.split(",")[1];
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getPointByAddress = async (
  address: string,
): Promise<{ lat: number; lng: number }> => {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=" +
        settings.googleGeoCoding,
    );

    return res.data.results[0].geometry.location;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const autocompleteAddress = async (query: string, onlyCity = false) => {
  try {
    const url = onlyCity
      ? `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${settings.googleGeoCoding}`
      : `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${settings.googleGeoCoding}`;
    const { error_message, predictions } = (await axios.get(url)).data;
    error_message && console.log(error_message);
    return error_message ? null : predictions;
  } catch (e) {
    console.log(e);
    return null;
  }
};
