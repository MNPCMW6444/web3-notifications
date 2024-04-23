import { Modal, Box, Typography } from "@mui/material";
import { TODO } from "@w3notif/shared";
import { Btn } from "../../styled-components";

export const InstallModal = ({ onInstallClicked }: TODO) => {
  return (
    <Modal open={true}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Install App
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Add this application to your home screen for a better experience.
        </Typography>
        <Btn onClick={onInstallClicked}>Install</Btn>
      </Box>
    </Modal>
  );
};
