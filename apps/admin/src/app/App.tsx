import Router from "./components/Router";
import {
  AuthContextProvider,
  EnvBorder,
  ServerProvider,
  useThemeForMVP,
  InstallModal,
} from "@w3notif/shared-react";
import { Box, createTheme, Grid, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { TODO } from "@w3notif/shared";

const App = () => {
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

  const theme = useThemeForMVP();

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <EnvBorder>
        {installPrompt && !isAppInstalled && (
          <InstallModal onInstallClicked={showInstallPrompt} />
        )}
        <Toaster />
        <ServerProvider>
          <AuthContextProvider client="admin">
            <Router />
          </AuthContextProvider>
        </ServerProvider>
      </EnvBorder>
    </ThemeProvider>
  );
};
export default App;
