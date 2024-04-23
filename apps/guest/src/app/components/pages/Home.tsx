import { Grid } from "@mui/material";
import { PrimaryText } from "@w3notif/shared-react";

const Home = () => {
  return (
    <Grid
      container
      direction="column"
      width="100%"
      height="calc(100vh - 100px)"
      alignItems="center"
      rowSpacing={4}
      paddingTop="20px"
      overflow="scroll"
      wrap="nowrap"
    >
      <Grid item>
        <PrimaryText>asdasd</PrimaryText>
      </Grid>
      <Grid item>
        <PrimaryText>asdasd</PrimaryText>
      </Grid>
      <Grid item>
        <PrimaryText>asdasd</PrimaryText>
      </Grid>
    </Grid>
  );
};

export default Home;
