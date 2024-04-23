import { Grid } from "@mui/material";
import {
  AuthContext,
  AuthPage,
  ChatContextProvider,
  TopBar,
} from "@w3notif/shared-react";
import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";

const Router = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {user ? (
        <Grid
          width="100%"
          height="100%"
          container
          justifyContent="center"
          bgcolor={(theme) => theme.palette.background.default}
          wrap="nowrap"
        >
          <Grid
            item
            height="100%"
            width="1000px"
            container
            direction="column"
            bgcolor={(theme) => theme.palette.background.paper}
            wrap="nowrap"
            overflow="hidden"
          >
            <TopBar />
            <Grid item height="100%" overflow="scroll">
              <Routes>
                <Route path="/*" element={<HomePage />} />
              </Routes>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <AuthPage />
      )}
    </BrowserRouter>
  );
};
export default Router;
