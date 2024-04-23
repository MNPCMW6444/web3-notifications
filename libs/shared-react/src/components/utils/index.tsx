import { Computer, Domain, LocalParking, Wifi } from "@mui/icons-material";
import toast from "react-hot-toast";
import { Box, CircularProgress, Grid, useTheme } from "@mui/material";
import { PrimaryText } from "../../styled-components";
import { TODO } from "@w3notif/shared";
import { cloneElement, forwardRef, useState } from "react";

// TODO: itai@w3notif.com
export const renderAmenityIcon = (amenity: string) =>
  amenity === "freeWiFi" ? (
    <Wifi />
  ) : amenity === "parking" ? (
    <LocalParking />
  ) : amenity === "lobbySpace" ? (
    <Domain />
  ) : (
    <Computer />
  );

export const axiosErrorToaster = (e: TODO) =>
  toast.error(
    typeof e?.response?.data === "object"
      ? e?.response?.data?.message ||
          e?.response?.data?.error ||
          JSON.stringify(e?.response?.data)
      : e?.response?.data ||
          (e?.response?.status
            ? "Error code " + e?.response?.status
            : "Unknown Error"),
  );

export const MainMessage = ({ text }: { text: string }) => (
  <Grid
    height="100%"
    width="100%"
    container
    justifyContent="center"
    alignItems="center"
  >
    <Grid item>
      <PrimaryText fontWeight="bold" fontSize="150%" textAlign="center">
        {text}
      </PrimaryText>
    </Grid>
  </Grid>
);

export const Img = forwardRef((props: TODO, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRatio16by9, setIsRatio16by9] = useState(false);

  const handleImageLoad = (event: TODO) => {
    setIsLoading(false);
    const { naturalWidth, naturalHeight } = event.target;
    const ratio = naturalWidth / naturalHeight;
    setIsRatio16by9(Math.abs(ratio - 16 / 9) < 0.01);
  };

  const handleClick = (event: TODO) => {
    if (!isRatio16by9 && props.onClick) {
      props.onClick(event);
    }
  };

  return (
    <Box
      position="relative"
      display="inline-block"
      {...props}
      onClick={handleClick}
    >
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
      <Box
        component="img"
        ref={ref}
        src={props.src}
        alt={props.alt}
        onLoad={handleImageLoad}
        style={{
          display: isLoading ? "none" : "inline",
          ...(props.style || {}),
        }}
        {...props}
      />
    </Box>
  );
});

export const MICO = ({ children }: TODO) => {
  const theme = useTheme();
  const styledChild = cloneElement(children, {
    style: { color: theme.palette.primary.contrastText },
  });
  return styledChild;
};
