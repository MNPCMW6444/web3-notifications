import axios from "axios";

export const findMe = (): Promise<null | { lat: number; lng: number }> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(location);
        },
        () => {
          resolve(null);
        },
      );
    }
  });
};

export const getSunTimes = async (
  location: {
    lat: number;
    lng: number;
  } | null,
) => {
  if (!location) return null;
  try {
    const { data } = await axios.get(
      `https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lng}&formatted=0`,
    );
    if (data.status === "OK") {
      return {
        sunset: new Date(data.results.sunset),
        sunrise: new Date(data.results.sunrise),
      };
    } else return null;
  } catch {
    return null;
  }
};
