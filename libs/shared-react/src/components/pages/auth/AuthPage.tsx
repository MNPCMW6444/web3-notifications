import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Grid, LinearProgress, Tooltip } from "@mui/material";
import { AuthContext, ServerContext } from "../../../context";
import {
  axiosErrorToaster,
  backgroundOffice,
  Btn,
  dayLogoTextOnly,
  Img,
  nightLogoTextOnly,
  PrimaryText,
  useIsNight,
  useResponsiveness,
} from "../../../";
import { useLocation } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { Flag } from "@mui/icons-material";
import { MIN_PASSWORD_STRENGTH, RegisterReq, TODO } from "@w3notif/shared";

enum Step {
  init,
  login,
  registerReq,
  registerFin,
  passResetReq,
  passResetFin,
  checkEmail,
}

type Labels = {
  [key in Step]: string;
};

interface LabelsConstants {
  IDLE: Labels;
  DOING: Labels;
}

export const LABELS: LabelsConstants = {
  IDLE: {
    [Step.init]: "Continiue",
    [Step.login]: "Login",
    [Step.registerReq]: "Send me a Link",
    [Step.registerFin]: "Register",
    [Step.passResetReq]: "Send Email",
    [Step.passResetFin]: "Change Password",
    [Step.checkEmail]: "",
  },
  DOING: {
    [Step.init]: "Please wait...",
    [Step.login]: "Checking password...",
    [Step.registerReq]: "Sending email...",
    [Step.registerFin]: "Registering...",
    [Step.passResetReq]: "Sending Email...",
    [Step.passResetFin]: "Saving Your Password...",
    [Step.checkEmail]: "",
  },
};

export const AuthPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [key, setKey] = useState<string>();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [buttonLabel, setButtonLabel] = useState<keyof LabelsConstants>("IDLE");
  const [step, setStep] = useState<Step>(Step.init);
  const [emailReason, setEmailReason] = useState<boolean>(true);
  const { refreshUserData, client } = useContext(AuthContext);

  const { isMobileOrTabl } = useResponsiveness(client === "guest");

  const server = useContext(ServerContext);
  const axiosInstance = server?.axiosInstance;

  useEffect(() => {
    step === Step.passResetReq && setEmailReason(false);
    step === Step.registerReq && setEmailReason(true);
  }, [step]);

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  useEffect(() => {
    const emaililing = query.get("e");
    const registerKey = query.get("regcode");
    const resetKey = query.get("rescode");
    const key = registerKey || resetKey;
    if (key) {
      setKey(key);
      registerKey && setStep(Step.registerFin);
      resetKey && setStep(Step.passResetFin);
    }
    if (emaililing) setEmail(emaililing);
  }, [query]);

  // Validation:

  const [validations, setValidations] = useState({
    email: true,
    password: true,
    passwordAgain: true,
    firstName: true,
    lastName: true,
  });

  useEffect(() => {
    setValidations(() => ({
      email: !!email,
      password:
        (step === Step.login && !!password) ||
        ((step === Step.registerFin || step === Step.passResetFin) &&
          zxcvbn(password).score >= MIN_PASSWORD_STRENGTH),
      passwordAgain: passwordAgain === password,
      firstName: !!firstName,
      lastName: !!lastName,
    }));
  }, [email, step, password, passwordAgain, firstName, lastName]);

  // Helper function to display error messages
  const getErrorMessage = (field: string) => {
    switch (field) {
      case "email":
        return "Email is required.";
      case "password":
        return step !== Step.login
          ? "Password is too weak."
          : "Password is required.";
      case "passwordAgain":
        return "Passwords do not match.";
      case "fullName":
        return "Full name is required.";
      default:
        return "";
    }
  };

  // Calculate password strength when password changes
  const [passwordStrength, setPasswordStrength] = useState<number>(1);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score);
    } else {
      setPasswordStrength(0); // reset strength score when password is cleared
    }
  }, [password]);

  // Function to map password strength score to progress percentage
  const getStrengthBarValue = (score: number) => {
    return (score / 4) * 100;
  };

  // Determine the color of the progress bar based on password strength
  const progressBarColor =
    passwordStrength < MIN_PASSWORD_STRENGTH ? "error" : "primary";

  const mainClickHandler: TODO = (customStep: Step | undefined) => {
    if (buttonLabel === "IDLE")
      switch (customStep || step) {
        case Step.init:
          return () => {
            setButtonLabel("DOING");
            axiosInstance &&
              axiosInstance
                .post("api/auth/log/in", {
                  email,
                  password: "lilush",
                  client,
                })
                .catch((error) =>
                  setStep(
                    error.response.data === "Please register"
                      ? Step.registerReq
                      : Step.login,
                  ),
                )
                .finally(() => setButtonLabel("IDLE"));
          };
        case Step.login:
          return () => {
            setButtonLabel("DOING");
            axiosInstance &&
              axiosInstance
                .post("api/auth/log/in", {
                  email,
                  password,
                  client,
                })
                .then(() => refreshUserData())
                .catch((error) => axiosErrorToaster(error))
                .finally(() => setButtonLabel("IDLE"));
          };
        case Step.registerReq:
          return () => {
            setButtonLabel("DOING");
            axiosInstance &&
              axiosInstance
                .post<undefined, undefined, RegisterReq>(
                  "api/auth/register/req",
                  {
                    email,
                    client,
                  },
                )
                .then(() => setStep(Step.checkEmail))
                .catch((error) => axiosErrorToaster(error))
                .finally(() => setButtonLabel("IDLE"));
          };
        case Step.registerFin:
          return () => {
            if (buttonLabel === "IDLE" && key) {
              setButtonLabel("DOING");
              axiosInstance &&
                axiosInstance
                  .post("api/auth/register/fin", {
                    key,
                    password,
                    passwordAgain,
                    fullName: firstName + " " + lastName,
                    firstName,
                    lastName,
                    type: client,
                  })
                  .then(() => refreshUserData())
                  .catch((error) => axiosErrorToaster(error))
                  .finally(() => setButtonLabel("IDLE"));
            }
          };
        case Step.passResetReq:
          return () => {
            setButtonLabel("DOING");
            axiosInstance &&
              axiosInstance
                .post("api/auth/manage/passresetreq", {
                  email,
                  client,
                })
                .then(() => setStep(Step.checkEmail))
                .catch((error) => axiosErrorToaster(error))
                .finally(() => setButtonLabel("IDLE"));
          };
        case Step.passResetFin:
          return () => {
            if (buttonLabel === "IDLE" && key) {
              setButtonLabel("DOING");
              axiosInstance &&
                axiosInstance
                  .post("api/auth/manage/passresetfin", {
                    key,
                    password,
                    passwordAgain,
                    type: client,
                  })
                  .then(() => refreshUserData())
                  .catch((error) => axiosErrorToaster(error))
                  .finally(() => setButtonLabel("IDLE"));
            }
          };
      }
  };

  const renderButtons = () => {
    const mainButton: { label: string; clickHandler?: () => void } = {
      clickHandler: mainClickHandler(undefined),
      label: LABELS[buttonLabel][step],
    };
    const navigateButton: {
      exists?: boolean;
      label?: string;
      clickHandler?: () => void;
    } = {};
    const resetButton: {
      exists?: boolean;
      label?: string;
      clickHandler?: () => void;
    } = {};

    switch (step) {
      case Step.init:
        navigateButton.exists = false;
        resetButton.exists = false;
        break;
      case Step.login:
        navigateButton.exists = false;
        navigateButton.clickHandler = () => setStep(Step.registerReq);
        navigateButton.label = "Register";
        resetButton.exists = true;
        resetButton.clickHandler = () => setStep(Step.passResetReq);
        resetButton.label = "Forgot Password?";
        break;
      case Step.registerReq:
        navigateButton.exists = false;
        navigateButton.clickHandler = () => setStep(Step.login);
        navigateButton.label = "Login";
        resetButton.exists = false;
        resetButton.label = "Forgot Password?";
        resetButton.clickHandler = () => setStep(Step.passResetReq);
        break;
      case Step.registerFin:
        navigateButton.exists = false;
        resetButton.exists = false;
        break;
      case Step.passResetReq:
        navigateButton.exists = false;
        navigateButton.clickHandler = () => setStep(Step.login);
        navigateButton.label = "Back to Login";
        resetButton.exists = false;
        break;
      case Step.passResetFin:
        navigateButton.exists = false;
        resetButton.exists = false;
        break;
    }

    if (client === "admin") {
      navigateButton.exists = false;
      resetButton.exists = false;
    }

    return (
      <Grid container direction="column" alignItems="center" rowSpacing={2}>
        <Grid item width="100%">
          <Btn
            type="submit"
            onClick={mainButton.clickHandler}
            sx={{ width: "100%" }}
          >
            {mainButton.label}
          </Btn>
        </Grid>
        {(navigateButton.exists || resetButton.exists) && (
          <Grid item container columnSpacing={2}>
            {navigateButton.exists && (
              <Grid item>
                <Btn
                  type="submit"
                  variant="text"
                  onClick={navigateButton.clickHandler}
                  sx={{ fontSize: resetButton.exists ? "70%" : "90%" }}
                >
                  {navigateButton.label}
                </Btn>
              </Grid>
            )}
            {resetButton.exists && (
              <Grid item>
                <Btn
                  type="submit"
                  variant="text"
                  onClick={resetButton.clickHandler}
                  sx={{ fontSize: navigateButton.exists ? "70%" : "90%" }}
                >
                  {resetButton.label}
                </Btn>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    );
  };

  const isNight = useIsNight();

  const authJSX = (
    <Box sx={{ padding: "20px", width: "75%" }}>
      <Grid container direction="column" alignItems="center" rowSpacing={2}>
        <Grid item>
          <PrimaryText variant="h5">Welcome to</PrimaryText>
        </Grid>
        <Grid item>
          <Tooltip title={server?.version} placement="right-start">
            <Img
              src={isNight ? nightLogoTextOnly : dayLogoTextOnly}
              width="100%"
              height="100%"
            />
          </Tooltip>
        </Grid>
        {client !== "guest" && (
          <Grid item>
            <PrimaryText variant="h6">for {client}s</PrimaryText>
          </Grid>
        )}
        <Grid item>
          {step === Step.checkEmail ? (
            <PrimaryText textAlign="center" sx={{ wordBreak: "break-word" }}>
              We sent {email} a link to
              {" " +
                (emailReason ? "activate your account" : "reset your password")}
              !
            </PrimaryText>
          ) : (
            <>
              {
                /*
                                step !== Step.registerFin &&
                */
                step !== Step.passResetFin && step !== Step.login && (
                  <TextField
                    disabled={
                      step === Step.registerFin || step === Step.registerReq
                    }
                    margin="dense"
                    label="Email"
                    type="email"
                    sx={{ width: "100%" }}
                    helperText={!validations.email && getErrorMessage("email")}
                    variant="standard"
                    value={email}
                    error={!validations.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )
              }
              {step === Step.registerFin && (
                <>
                  <TextField
                    margin="dense"
                    label="First Name"
                    sx={{ width: "100%" }}
                    helperText={
                      !validations.firstName && getErrorMessage(" firstName")
                    }
                    variant="standard"
                    value={firstName}
                    error={!validations.firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Last Name"
                    sx={{ width: "100%" }}
                    helperText={
                      !validations.lastName && getErrorMessage(" lastName")
                    }
                    variant="standard"
                    value={lastName}
                    error={!validations.lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </>
              )}
              {(step === Step.login ||
                step === Step.registerFin ||
                step === Step.passResetFin) && (
                <>
                  <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    sx={{ width: "100%" }}
                    helperText={
                      !validations.password && getErrorMessage("password")
                    }
                    variant="standard"
                    value={password}
                    error={!validations.password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {step === Step.registerFin ||
                    (step === Step.passResetFin && (
                      <Box
                        position="relative"
                        display="flex"
                        alignItems="center"
                        width="100%"
                        mt={1}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={getStrengthBarValue(passwordStrength)}
                          color={progressBarColor}
                          style={{ width: "100%" }}
                        />
                        <Box
                          position="absolute"
                          left={`${(MIN_PASSWORD_STRENGTH / 4) * 100 - 5}%`}
                          top={0}
                        >
                          <Grid container>
                            <Grid item>
                              <Flag />
                            </Grid>
                            <Grid item>
                              <PrimaryText>Min</PrimaryText>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    ))}
                </>
              )}
              {(step === Step.registerFin || step === Step.passResetFin) && (
                <br />
              )}
              {(step === Step.registerFin || step === Step.passResetFin) && (
                <>
                  <TextField
                    margin="dense"
                    label="Re-enter password"
                    type="password"
                    sx={{ width: "100%" }}
                    helperText={
                      !validations.passwordAgain &&
                      getErrorMessage(" passwordAgain")
                    }
                    variant="standard"
                    value={passwordAgain}
                    error={!validations.passwordAgain}
                    onChange={(e) => setPasswordAgain(e.target.value)}
                  />
                </>
              )}
            </>
          )}
        </Grid>
        {LABELS[buttonLabel][step] && (
          <Grid item>
            <Box mt={2}>{renderButtons()}</Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      wrap="nowrap"
    >
      <Grid
        item
        container
        width={isMobileOrTabl || client === "guest" ? "100%" : "40%"}
        height="100%"
        justifyContent="center"
        paddingTop="13%"
      >
        {authJSX}
      </Grid>
      {client === "host" && !isMobileOrTabl && (
        <Grid item width="60%" height="100%">
          <Img src={backgroundOffice} maxHeight="100%" width="auto" />
        </Grid>
      )}
    </Grid>
  );
};
