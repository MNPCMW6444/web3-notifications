import {
  AuthContextProvider,
  EnvBorder,
  ServerProvider,
  useThemeForMVP,
} from "@w3notif/shared-react";
import Router from "./components/Router";
import { Toaster } from "react-hot-toast";
import { createTheme, ThemeProvider } from "@mui/material";

const App = () => {
  const theme = useThemeForMVP();

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <EnvBorder>
        <Toaster />
        <ServerProvider>
          <AuthContextProvider client="host">
            <Router />
          </AuthContextProvider>
        </ServerProvider>
      </EnvBorder>
    </ThemeProvider>
  );
};

export default App;
