import { LocationOn, Search } from "@mui/icons-material";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { MICO, PrimaryText, ServerContext } from "@w3notif/shared-react";
import { Grid, IconButton } from "@mui/material";
import { findMe } from "@w3notif/shared-react";

interface HomeTopProps {
  setSearch: Dispatch<SetStateAction<boolean>>;
}

const HomeTop = ({ setSearch }: HomeTopProps) => {
  const [address, setAddress] = useState("Current Address");
  const server = useContext(ServerContext);
  const axiosInstance = server?.axiosInstance;

  useEffect(() => {
    findMe().then(
      (location) =>
        location &&
        axiosInstance &&
        axiosInstance
          .get("/api/geo/getAddress/" + location.lat + "," + location.lng)
          .then((r) => setAddress(r.data || "Current Address")),
    );
  }, [axiosInstance]);

  return (
    <Grid container justifyContent="space-between">
      <Grid item>
        <IconButton>
          <MICO>
            <LocationOn />
          </MICO>
          <PrimaryText>{address}</PrimaryText>
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={() => setSearch(true)}>
          <MICO>
            <Search />
          </MICO>
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default HomeTop;
