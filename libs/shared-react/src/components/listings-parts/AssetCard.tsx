import { Asset } from "@w3notif/shared";
import { Box, Grid } from "@mui/material";
import { PrimaryText } from "../../styled-components";
import { useNavigate } from "react-router-dom";
import { getAmenityIcon, mock1 } from "../../assets";
import { ImageCarousel } from "../";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      direction="column"
      width="96%"
      marginLeft="2%"
      padding="10%"
      rowSpacing={2}
      onClick={() => navigate("/?space=" + asset._id.toString())}
      borderRadius="10px"
      border="1px solid #C5C5C5"
      style={{ cursor: "pointer" }}
    >
      <Grid item width="100%">
        <ImageCarousel
          imagesArray={
            asset.photoURLs?.map((url, index) => ({
              label: `Photo${index + 1}`,
              alt: `Photo${index + 1}`,
              imgPath: url,
            })) || [{ label: "Photo1", alt: "Photo1", imgPath: mock1 }]
          }
        />
      </Grid>
      <Grid
        item
        container
        justifyContent="space-between"
        alignItems="center"
        wrap="nowrap"
        width="100%"
      >
        <Grid item width="85%">
          <PrimaryText>{asset.assetDescription}</PrimaryText>
        </Grid>
        <Grid item>
          <PrimaryText>rating</PrimaryText>
        </Grid>
      </Grid>
      <Grid
        item
        container
        justifyContent="space-between"
        alignItems="center"
        wrap="nowrap"
        width="100%"
      >
        <Grid item container alignItems="center" columnSpacing={2} width="60%">
          {asset.assetAmenities?.map((amenity) => (
            <Grid item>
              {getAmenityIcon(amenity.name) ? (
                <Box component="img" src={getAmenityIcon(amenity.name)} />
              ) : (
                <PrimaryText>{amenity.name}</PrimaryText>
              )}
            </Grid>
          ))}
        </Grid>
        <Grid item>
          <PrimaryText>{asset.leaseCondition?.monthlyPrice}$/Month</PrimaryText>
        </Grid>
      </Grid>
    </Grid>
  );
};
