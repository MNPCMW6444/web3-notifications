import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AuthContext,
  AuthPage,
  NotificationsPage,
  SettingPage,
  TopBar,
} from "@w3notif/shared-react";
import SummeryPage from "./pages/summery/SummeryPage";
import { Grid } from "@mui/material";
import { ChatsPage } from "@w3notif/shared-react";
import { ListingsContextProvider } from "../context/ListingsContext";
import { ChatContextProvider } from "@w3notif/shared-react";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { BookingsContextProvider } from "../context/BookingsContext";

const routes = [
  { name: "Summery", route: "summery" },
  { name: "Dashboard", route: "dashboard" },
  {
    name: "Chats",
    route: "chats",
  },
  { name: "Settings", route: "settings" },
  { name: "Logout", route: "logout" },
];

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
            bgcolor={(theme) => theme.palette.background.default}
            wrap="nowrap"
            overflow="hidden"
          >
            <ChatContextProvider>
              <Grid item>
                <TopBar routes={routes} />
              </Grid>
              <Grid item height="calc(100% - 90px)" overflow="scroll">
                <Routes>
                  <Route path="/*" element={<SummeryPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ListingsContextProvider>
                        <BookingsContextProvider>
                          <DashboardPage />
                        </BookingsContextProvider>
                      </ListingsContextProvider>
                    }
                  ></Route>
                  <Route path="/chats" element={<ChatsPage />} />
                  <Route path="/settings" element={<SettingPage />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                </Routes>
              </Grid>
            </ChatContextProvider>
          </Grid>
        </Grid>
      ) : (
        <AuthPage />
      )}
    </BrowserRouter>
  );
};
export default Router;
