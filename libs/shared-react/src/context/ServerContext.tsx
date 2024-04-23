import { createContext, useEffect, useState, useRef, ReactNode } from "react";
import axios, { AxiosInstance } from "axios";
import { MainMessage } from "../components";

export const frontendSettings = () => {
  try {
    const envConfig = document.getElementById("env-config")?.textContent;
    return JSON.parse(envConfig || "{}");
  } catch (e) {
    return import.meta.env;
  }
};

const DEFAULT_TRY_INTERVAL = 3000;
const GOOD_STATUS = "good";
const BAD_MESSAGE = "Server is not available. Please try again later.";
const FIRST_MESSAGE = "Connecting to server...";

interface ServerProviderProps {
  children: ReactNode;
  tryInterval?: number;
}

interface ServerContextProps {
  axiosInstance: AxiosInstance;
  version: string;
}

export const ServerContext = createContext<ServerContextProps | null>(null);

const { VITE_WHITE_ENV } = frontendSettings();

export const getBaseURL = () =>
  VITE_WHITE_ENV === "local"
    ? "http://localhost:5556/"
    : `https://${VITE_WHITE_ENV === "preprod" ? "pre" : ""}server.w3notif.com/`;

export const ServerProvider = ({
  tryInterval,
  children,
}: ServerProviderProps) => {
  const interval = tryInterval || DEFAULT_TRY_INTERVAL;
  const [status, setStatus] = useState<string>(BAD_MESSAGE || FIRST_MESSAGE);
  const [version, setVersion] = useState<string>("");
  const statusRef = useRef(status);

  const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const scheduleNextCheck = () => {
    setTimeout(setStatusAsyncly, interval);
  };

  const setStatusAsyncly = async () => {
    try {
      const response = await axiosInstance.get("api");
      const newStatus =
        response.data.status === "Im alive"
          ? GOOD_STATUS
          : BAD_MESSAGE || FIRST_MESSAGE;

      setStatus(newStatus);
      if (newStatus === GOOD_STATUS) {
        setVersion(response.data.version);
      } else {
        scheduleNextCheck();
      }
    } catch (error) {
      console.log("An error occurred while checking the server: ", error);
      scheduleNextCheck();
    }
  };

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (
      statusRef.current === BAD_MESSAGE ||
      statusRef.current === FIRST_MESSAGE
    ) {
      setStatusAsyncly().then();
    }
  }, [axiosInstance, interval]);

  if (status === GOOD_STATUS) {
    return (
      <ServerContext.Provider value={{ axiosInstance, version }}>
        {children}
      </ServerContext.Provider>
    );
  } else {
    return <MainMessage text={status} />;
  }
};
