import { Box, Divider, Grid } from "@mui/material";
import { ImageCarousel } from "./ImageCarousel";
import { LocationOn } from "@mui/icons-material";
import { Btn, PrimaryText } from "../../../styled-components";
import { Asset } from "@w3notif/shared";
import { useState } from "react";
import {
  BookingRequestForm,
  getAmenityIcon,
  HostCard,
  MICO,
  mock1,
} from "../../../";
import SendMessageForm from "../../forms/SendMessageForm";
import { ResultsMap } from "../../";

interface ListingPageProps {
  space: Asset;
}

export const ListingPage = ({ space }: ListingPageProps) => {
  const [modal, setModal] = useState<"" | "book" | "message">("");

  return space ? (
    <Grid
      height="100%"
      width="100%"
      container
      direction="column"
      justifyContent="space-between"
      alignContent="center"
      wrap="nowrap"
    >
      <Grid item width="100%" overflow="scroll">
        {modal &&
          (modal === "book" ? (
            <BookingRequestForm close={() => setModal("")} asset={space} />
          ) : (
            <SendMessageForm
              id={space.companyId.toString()}
              amIaGuest
              spaceId={space._id.toString()}
              close={() => setModal("")}
            />
          ))}
        <Grid container direction="column" rowSpacing={2}>
          <Grid item>
            <ImageCarousel
              imagesArray={
                space.photoURLs?.map((url, index) => ({
                  label: `Photo${index + 1}`,
                  alt: `Photo${index + 1}`,
                  imgPath: url,
                })) || [{ label: "Photo1", alt: "Photo1", imgPath: mock1 }]
              }
            />
          </Grid>
          {space.assetAmenities && (
            <Grid
              item
              width="100%"
              container
              alignItems="center"
              columnSpacing={2}
            >
              {space.assetAmenities.map((amenity) => (
                <Grid item>
                  {getAmenityIcon(amenity.name) ? (
                    <Box component="img" src={getAmenityIcon(amenity.name)} />
                  ) : (
                    <PrimaryText>{amenity.name}</PrimaryText>
                  )}
                </Grid>
              ))}
            </Grid>
          )}
          <Grid item>
            <PrimaryText variant="h4">{space.assetDescription}</PrimaryText>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item>
              <MICO>
                <LocationOn />
              </MICO>
            </Grid>
            {space.address && (
              <Grid item>
                <PrimaryText>
                  {Object.keys(space.address)
                    .filter((name) => name !== "_id")
                    .map((key) =>
                      space.address
                        ? space.address[key as keyof typeof space.address]
                        : [],
                    )
                    .join(", ")}
                </PrimaryText>
              </Grid>
            )}
          </Grid>
          <Divider />
          <Grid item>
            <HostCard companyId={space.companyId.toString()} />
          </Grid>
          <Divider />
          <Divider />
          <Grid item>
            <PrimaryText variant="h5">Your w3notif location</PrimaryText>
          </Grid>
          {space.address && (
            <Grid item>
              <PrimaryText>
                {Object.keys(space.address)
                  .filter((name) => name !== "_id")
                  .map((key) =>
                    space.address
                      ? space.address[key as keyof typeof space.address]
                      : [],
                  )
                  .join(", ")}
              </PrimaryText>
            </Grid>
          )}
          <Grid item width="100%" height="calc(100vh * 9 / 16)">
            <ResultsMap setMap={() => {}} assets={[space]} single />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        width="100%"
        container
        justifyContent="center"
        alignItems="center"
        columnSpacing={2}
        paddingTop="10px"
      >
        <Grid item>
          <Btn onClick={() => setModal("book")}>Book this Space</Btn>
        </Grid>
        <Grid item>
          <Btn onClick={() => setModal("message")}>Message the host</Btn>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <PrimaryText>Loading Listing...</PrimaryText>
  );
};
