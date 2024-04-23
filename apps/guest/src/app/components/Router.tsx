import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import {
  AuthContext,
  AuthPage,
  ChatContextProvider,
} from "@w3notif/shared-react";
import NavBar from "./pages/NavBar";

const Router = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {user ? (
          <NavBar />
      ) : (
        <AuthPage />
      )}
    </BrowserRouter>
  );
};

export default Router;
