import { useMediaQuery } from "@mui/material";

export const useResponsiveness = (guest: boolean) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isMobileOrTabl = useMediaQuery("(max-width:900px)");
  return {
    isMobile: guest || isMobile,
    isMobileOrTabl: guest || isMobileOrTabl,
  };
};
