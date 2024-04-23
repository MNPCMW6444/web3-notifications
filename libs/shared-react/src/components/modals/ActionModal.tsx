import { Grid, IconButton, Modal } from "@mui/material";
import { axiosErrorToaster } from "../utils";
import { ReactNode, useContext, useState } from "react";
import { ServerContext } from "../../context";
import { Btn, PrimaryText } from "../../styled-components";
import toast from "react-hot-toast";

interface ActionModalProps {
  closeModal: () => void;
  endpoint: string | (() => void);
  name: string | ReactNode;
  doingName: string;
  method: "post" | "put" | "patch" | "delete";
  cb?: () => void;
}

export const ActionModal = ({
  closeModal,
  endpoint,
  name,
  doingName,
  method,
  cb,
}: ActionModalProps) => {
  const server = useContext(ServerContext);
  const [deleting, setDeleting] = useState(false);

  return (
    <Modal open>
      <Grid
        container
        height="100%"
        bgcolor={(theme) => theme.palette.background.default}
        direction="column"
        justifyContent="center"
        alignItems="center"
        rowSpacing={2}
      >
        <Grid item>
          <PrimaryText variant="h4">Are you sure?</PrimaryText>
        </Grid>
        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          columnSpacing={2}
        >
          <Grid item>
            {deleting ? (
              <Btn disabled>{doingName}</Btn>
            ) : (
              <Btn
                color="error"
                onClick={
                  typeof endpoint === "string"
                    ? () => {
                        setDeleting(true);
                        server?.axiosInstance?.[method](endpoint)
                          .then(() => toast.success("Success"))
                          .catch((e) => axiosErrorToaster(e))
                          .finally(() => {
                            closeModal();
                            setDeleting(false);
                            cb && cb();
                          });
                      }
                    : endpoint
                }
              >
                {name}
              </Btn>
            )}
          </Grid>
          <Grid item>
            <Btn variant="outlined" onClick={() => closeModal()}>
              cancel
            </Btn>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};
