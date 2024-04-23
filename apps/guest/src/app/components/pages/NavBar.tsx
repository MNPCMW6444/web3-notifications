import {
  alpha,
  Backdrop,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Grid,
} from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import FindPage from "./search/FindPage";
import MyPage from "./my/MyPage";
import {
  ChatsPage,
  MICO,
  NotificationsPage,
  SearchContext,
  SettingPage,
} from "@w3notif/shared-react";
import SearchBackdrop from "./search/SearchBackdrop";
import { useContext, useEffect, useMemo } from "react";
import { home, favorites, messages, person } from "@w3notif/shared-react";

const NavBar = () => {
  const navigate = useNavigate();

  const { search, results } = useContext(SearchContext);

  const useQuery = () => {
    const location = useLocation();
    return useMemo(
      () => new URLSearchParams(location.search),
      [location.search],
    );
  };

  const query = useQuery();

  return (
    <Grid
      height="100%"
      width="100%"
      container
      direction="column"
      justifyContent="space-between"
      alignContent="center"
      wrap="nowrap"
    >
      <Grid item width="100%" overflow="scroll" height="100%">
        {search ? (
          <Backdrop
            sx={{
              backgroundColor: (theme) =>
                alpha(theme.palette.background.default, 0.95),
              zIndex: 100,
              position: "relative", // can be absolute so that we see the background bluey but for lilush its relative. if absolute then need to fix position size and trinary to both - only first is conditional
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
            }}
            open
          >
            <SearchBackdrop />
          </Backdrop>
        ) : (
          <Routes>
            <Route path="/*" element={<FindPage />} />
            <Route path="/my" element={<MyPage />} />
            <Route path="/chats" element={<ChatsPage isGuest />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/notification" element={<NotificationsPage />} />
          </Routes>
        )}
      </Grid>
      {(!search || results) && !query.get("space") && (
        <Grid item width="100%">
          <BottomNavigation
            sx={(theme) => ({
              bgcolor: theme.palette.primary.main,
            })}
            showLabels
            value={"value"}
            onChange={(_, newValue) => {
              switch (newValue) {
                case 1:
                  navigate("/wish");
                  break;
                case 2:
                  navigate("/chats");
                  break;
                case 3:
                  navigate("/settings");
                  break;
                default:
                  navigate("/");
                  break;
              }
            }}
          >
            <BottomNavigationAction
              icon={
                <MICO>
                  <Box component="img" src={home} />
                </MICO>
              }
            />
            <BottomNavigationAction
              disabled
              icon={
                <MICO>
                  <Box component="img" src={favorites} />
                </MICO>
              }
            />
            <BottomNavigationAction
              icon={
                <MICO>
                  <Box component="img" src={messages} />
                </MICO>
              }
            />
            <BottomNavigationAction
              icon={
                <MICO>
                  <Box component="img" src={person} />
                </MICO>
              }
            />
          </BottomNavigation>
        </Grid>
      )}
    </Grid>
  );
};

export default NavBar;
