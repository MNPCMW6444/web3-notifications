import { ReactNode, createContext } from "react";

type Value = "guest" | "host" | "admin";

interface AppContextProps {
  children: ReactNode;
  app: Value;
}

export const AppContext = createContext<{
  app?: Value;
}>({
  app: "admin",
});

export const AppContextProvider = ({ children, app }: AppContextProps) => {
  return (
    <AppContext.Provider
      value={{
        app,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
