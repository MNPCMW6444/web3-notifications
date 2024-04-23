import { Grid } from "@mui/material";
import { PrimaryText } from "@w3notif/shared-react";
/*import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useNavigate } from "react-router-dom";*/

const SummeryPage = () => {
  /*
    const navigate = useNavigate();
  */

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      height="100%"
      width="100%"
      rowSpacing={6}
      wrap="nowrap"
      padding="20px 25px 0 25px"
    >
      <Grid item alignSelf="flex-start">
        <PrimaryText variant="h4" paddingLeft="50px">
          Summery
        </PrimaryText>
      </Grid>
      {/*  <Grid item>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={false}
          events={[
            { title: 'event 1', date: '2024-02-01' },
            { title: 'event 2', date: '2024-02-02' },
          ]}
        />
      </Grid>*/}
      <Grid item container justifyContent="space-around" alignItems="center">
        <Grid item>
          <PrimaryText>Total booking value</PrimaryText>
        </Grid>
        <Grid item>
          <PrimaryText>Total inqueries</PrimaryText>
        </Grid>
        <Grid item>
          <PrimaryText>Occupancy rate</PrimaryText>
        </Grid>
      </Grid>
      <Grid item container justifyContent="space-around" alignItems="center">
        <Grid item>
          <PrimaryText>Current requests</PrimaryText>
        </Grid>
        <Grid item>
          <PrimaryText>Occupancy rate</PrimaryText>
        </Grid>
        <Grid item>
          <PrimaryText>Total inqueries</PrimaryText>
        </Grid>
        <Grid item>
          <PrimaryText>Occupancy rate</PrimaryText>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        rowSpacing={2}
      >
        <Grid item>
          <PrimaryText>All Rights Reserved © 2024 w3notif Inc.</PrimaryText>
        </Grid>
        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          columnSpacing={2}
        >
          <Grid item>
            <PrimaryText>Terms of use</PrimaryText>
          </Grid>
          <Grid item>
            <PrimaryText>Privacy policy</PrimaryText>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default SummeryPage;
