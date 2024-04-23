import { Divider, Grid, IconButton } from "@mui/material";
import {
  AuthContext,
  axiosErrorToaster,
  Btn,
  PrimaryText,
  renderTextField,
  ServerContext,
  useResponsiveness,
} from "@w3notif/shared-react";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { PushDevice } from "@w3notif/shared";

const Home = () => {
  const { user, refreshUserData } = useContext(AuthContext);
  if (!user) return undefined;
  type Data = typeof user.data;
  const [formState, setFormState] = useState<Data>(user.data);

  const handleChange: any = (
    path: string[],
    value: string | Date | boolean,
  ) => {
    setFormState((prevState) => {
      const newState = { ...prevState }; // Create a shallow copy of the state
      let current: any = newState;

      // Iterate through the path array except for the last key
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];

        // If the key does not exist or is not an object, create a new object
        if (typeof current[key] !== "object") {
          current[key] = {};
        }

        // Move our reference down into the next level of the state object
        current = current[key];
      }

      // Set the value at the final key in the path
      const finalKey = path[path.length - 1];
      current[finalKey] = value;

      return newState;
    });
  };

  const [name, setName] = useState("");
  const [devices, setDevices] = useState<PushDevice[]>([]);

  const fetchDevices = async () => {
    try {
      user?.data?.secrets?.stringified_Devices?.map &&
        setDevices(
          user?.data?.secrets?.stringified_Devices?.map((x) => JSON.parse(x)),
        );
    } catch (e) {
      axiosErrorToaster(e);
    }
  };

  useEffect(() => {
    fetchDevices().then();
  }, [user]);

  const server = useContext(ServerContext);

  useEffect(() => {
    server?.axiosInstance
      .post("api/manage", formState)
      .finally(() => refreshUserData());
  }, [formState, server?.axiosInstance]);

  const handleSubscribeClick = () => {
    navigator.serviceWorker.ready.then((registration) => {
      const base64String =
        "BH1R9v3i49K6RwINhRAIGDWeD5Qc4P8goayR9Zse5GHr8P6TftjYECx98M-C7YBpA-DPbnM_k_QdZgQc5QnWgU8";
      const padding = "=".repeat((4 - (base64String?.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData?.length);
      for (let i = 0; i < rawData?.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: outputArray,
        })
        .then((pushSubscription) => {
          const subscription = {
            endpoint: pushSubscription.endpoint,
            keys: {
              p256dh: pushSubscription?.toJSON()?.keys?.p256dh,
              auth: pushSubscription?.toJSON()?.keys?.auth,
            },
          };
          setFormState((p) => ({
            ...p,
            secrets: {
              ...p.secrets,
              stringified_Devices: [
                ...p.secrets.stringified_Devices,
                JSON.stringify({
                  name,
                  subscription,
                }),
              ],
            },
          }));
          fetchDevices().then();
        })
        .catch((error) => {
          console.log("Error during getSubscription()", error);
        });
    });
  };

  const { isMobile } = useResponsiveness(true);

  return (
    <Grid
      container
      direction="column"
      width="100%"
      height="calc(100vh - 1px)"
      alignItems="center"
      rowSpacing={4}
      paddingTop="20px"
      overflow="scroll"
      wrap="nowrap"
    >
      <Grid item>
        {renderTextField(formState, handleChange, ["secrets", "twilio_sid"])}
      </Grid>
      <Grid item>
        {renderTextField(formState, handleChange, [
          "secrets",
          "twilio_service",
        ])}
      </Grid>
      <Grid item>
        {renderTextField(formState, handleChange, ["secrets", "twilio_secret"])}
      </Grid>
      <Grid item>
        {renderTextField(
          formState,
          handleChange,
          ["secrets", "twilio_Number"],
          { number: true },
        )}
      </Grid>{" "}
      <Grid item>
        {renderTextField(
          formState,
          handleChange,
          ["secrets", "twilio_Receiver"],
          { number: true },
        )}
      </Grid>
      <Grid item>
        {renderTextField(formState, handleChange, ["secrets", "twilio_Sender"])}
      </Grid>
      <Grid item>
        {renderTextField(formState, handleChange, ["secrets", "sendgrid_API"])}
      </Grid>
      <Grid item>
        {renderTextField(formState, handleChange, [
          "secrets",
          "sendgrid_Address",
        ])}
      </Grid>
      <Grid item>
        {renderTextField(
          formState,
          handleChange,
          ["secrets", "interval_inseconds"],
          { number: true },
        )}
      </Grid>
      {devices.map(({ name }) => (
        <Grid key={name} item container alignItems="center" columnSpacing={4}>
          <Grid item>
            <PrimaryText>
              <strong>Push:</strong> {name}
            </PrimaryText>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => {
                setFormState((p) => ({
                  ...p,
                  secrets: {
                    ...p.secrets,
                    stringified_Devices: p.secrets.stringified_Devices.filter(
                      (str) => JSON.parse(str).name !== name,
                    ),
                  },
                }));
                fetchDevices().then();
              }}
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item container alignItems="center" columnSpacing={4}>
        <Grid item>
          <TextField
            variant="outlined"
            label="Device Name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
          />
        </Grid>
        <Grid item>
          <Btn onClick={handleSubscribeClick}>
            Add {isMobile ? "" : " this device"}
          </Btn>
        </Grid>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <PrimaryText>Saved data: {JSON.stringify(user?.data)}</PrimaryText>
      </Grid>
    </Grid>
  );
};

export default Home;
