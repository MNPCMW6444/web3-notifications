import { ThemeOptions } from "@mui/material";
import { frontendSettings } from "../context";
import { useEffect, useMemo, useState } from "react";
import { findMe, getSunTimes } from "../utils";

export const backGroundColor = "#FAF1E1";
export const themeColor = "#1976D2";

export const useIsNight = () => {
  const calculateIsNight = async () => {
    const todayat6 = new Date(Date.now()).setHours(6, 0, 0, 0);
    const todayat18 = new Date(Date.now()).setHours(18, 0, 0, 0);
    const seconds = new Date().getSeconds();
    const segment = Math.floor(seconds / 10); // Divides the minute into 6 segments of 10 seconds each
    const isNightSegment = segment % 2 === 0; // Alternates between 'day' and 'night' every segment
    const sunTimes = await getSunTimes(await findMe());
    return frontendSettings().VITE_WHITE_ENV === "local"
      ? isNightSegment
      : window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : new Date().getTime() <
            (sunTimes ? sunTimes.sunrise.getTime() : todayat6) ||
          new Date().getHours() >= todayat18;
  };

  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    calculateIsNight().then((isNight) => setIsNight(isNight));
    const interval = setInterval(async () => {
      setIsNight(await calculateIsNight());
    }, 10000); // Updates every 10 seconds based on the segment logic
    return () => clearInterval(interval);
  }, []);

  return isNight;
};

export const useThemeForMVP = () => {
  const isNight = useIsNight();
  const theme = useMemo(
    () =>
      ({
        palette: {
          mode: isNight ? "dark" : "light",
          primary: {
            main: isNight ? "#42A5F5" : themeColor,
            contrastText: isNight ? "#FFFFFF" : "#101714",
          },
          secondary: {
            main: isNight ? "#E19D34" : "#D27619",
            contrastText: isNight ? "#ffffff" : "#FFFFFF",
          },
          error: {
            main: "#F44336",
            contrastText: "#FFFFFF",
          },
          warning: {
            main: "#FF9800",
            contrastText: "#FFFFFF",
          },
          info: {
            main: "#2196F3",
            contrastText: "#FFFFFF",
          },
          success: {
            main: "#4CAF50",
            contrastText: "#FFFFFF",
          },
          text: {
            primary: isNight ? "#FFFFFF" : "#000000",
          },
          background: {
            default: isNight ? "#171C1E" : "#FFFFFF",
            paper: isNight ? "#373D3E" : backGroundColor,
          },
        },
        typography: {
          fontFamily: '"Inter", "Arial", sans-serif',
          h1: {
            fontFamily: '"Open Sans", "Arial", sans-serif',
            fontWeight: 700,
            fontSize: "2.25rem",
          },
          h2: {
            fontFamily: '"Open Sans", "Arial", sans-serif',
            fontWeight: 700,
            fontSize: "2rem",
          },
          h3: {
            fontFamily: '"Open Sans", "Arial", sans-serif',
            fontWeight: 700,
            fontSize: "1.75rem",
          },
          h4: {
            fontFamily: '"Open Sans", "Arial", sans-serif',
            fontWeight: 700,
            fontSize: "1.5rem",
          },
          h5: {
            fontFamily: '"Open Sans", "Arial", sans-serif',
            fontWeight: 700,
            fontSize: "1.25rem",
          },
          h6: {
            fontFamily: '"Open Sans", "Arial", sans-serif',
            fontWeight: 700,
            fontSize: "1rem",
          },
          subtitle1: {
            fontFamily: '"Open Sans", "Arial", sans-serif',
            fontSize: "0.875rem",
          },
          subtitle2: {
            fontFamily: '"Open Sans", "Arial", sans-serif',
            fontSize: "0.875rem",
          },
          body1: {
            fontFamily: '"Inter", "Arial", sans-serif',
            fontSize: "1rem",
          },
          body2: {
            fontFamily: '"Inter", "Arial", sans-serif',
            fontSize: "0.875rem",
          },
        },
      }) as ThemeOptions,
    [isNight],
  );

  return theme;
};
