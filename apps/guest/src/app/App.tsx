import Router from "./components/Router";
import {
  AuthContextProvider,
  EnvBorder,
  PrimaryText,
  ServerProvider,
  useResponsiveness,
  useThemeForMVP,
  InstallModal,
} from "@w3notif/shared-react";
import styled from "@emotion/styled";
import { Box, createTheme, Grid, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { SearchContextProvider } from "@w3notif/shared-react";
import { TODO } from "@w3notif/shared";

const MobileContainer = styled(Box)`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 2px solid #0000000;
  height: 96vh;
  width: calc(98vh / 16 * 9);
  margin-top: 2vh;
  overflow: hidden;
`;

const DesktopMessage = styled(Box)`
  text-align: center;
  margin-left: 20px;
  margin-top: 300px;
  font-size: 18px;
  color: #666;
  align-self: center;
`;

const App = () => {
  const { isMobile } = useResponsiveness(false /*This is not a mistake*/);
  const [installPrompt, setInstallPrompt] = useState<TODO>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    window.addEventListener("appinstalled", () => {
      setIsAppInstalled(true);
    });
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: TODO) => {
      e.preventDefault();
      if (!isAppInstalled) {
        setInstallPrompt(e);
      }
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, [isAppInstalled]);

  const showInstallPrompt = () => {
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: TODO) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setInstallPrompt(null);
    });
  };

  const app = (
    <>
      {installPrompt && !isAppInstalled && (
        <InstallModal onInstallClicked={showInstallPrompt} />
      )}
      <Toaster />
      <ServerProvider>
        <AuthContextProvider client="guest">
          <SearchContextProvider>
            <Router />
          </SearchContextProvider>
        </AuthContextProvider>
      </ServerProvider>
    </>
  );
  const theme = useThemeForMVP();
  return (
    <ThemeProvider theme={createTheme(theme)}>
      <EnvBorder>
        {isMobile ? (
          app
        ) : (
          <Grid
            container
            justifyContent="center"
            columnSpacing={8}
            wrap="nowrap"
          >
            <Grid item>
              <MobileContainer>{app}</MobileContainer>
            </Grid>
            <Grid item>
              <DesktopMessage>
                <PrimaryText variant="h5">
                  For the best experience please use w3notif app on a mobile
                  device
                </PrimaryText>
              </DesktopMessage>
            </Grid>
          </Grid>
        )}
      </EnvBorder>
    </ThemeProvider>
  );
};
export default App;
