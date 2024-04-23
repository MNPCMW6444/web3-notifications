import { Grid, Modal } from "@mui/material";
import {
  Btn,
  CloseButton,
  Img,
  PictureUploader,
  PrimaryText,
  ServerContext,
} from "@w3notif/shared-react";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import toast from "react-hot-toast";
import { Asset } from "@w3notif/shared";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { type Crop } from "react-image-crop";

interface PicturesModalModalProps {
  setPicturesModal: Dispatch<SetStateAction<boolean>>;
  fetchSpace: (id: string) => Promise<void>;
  formState: Asset | undefined;
}

const PicturesModal = ({
  setPicturesModal,
  fetchSpace,
  formState,
}: PicturesModalModalProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [selectedKey, setSelectedKey] = useState<string>();
  const [selectedPreview, setSelectedPreview] = useState<string>();
  const server = useContext(ServerContext);
  const [ready, setReady] = useState(false);

  return (
    <Modal open>
      <Grid
        height="73%"
        width="72%"
        marginLeft="14%"
        marginTop="7%"
        padding="2%"
        overflow="scroll"
        item
        container
        direction="column"
        rowSpacing={4}
        alignItems="center"
        wrap="nowrap"
        bgcolor={(theme) => theme.palette.background.default}
      >
        <Grid item>
          <CloseButton onClick={() => setPicturesModal(false)} />
        </Grid>
        <Grid item>
          <PrimaryText variant="h4">Pictures</PrimaryText>
        </Grid>
        {formState && (
          <>
            <Grid item>
              <PictureUploader
                cb={() => {
                  toast.success("Uploaded");
                  fetchSpace(formState?._id.toString());
                }}
                endpoint={
                  "api/host/assets/images/upload_asset_img/" +
                  formState?._id.toString()
                }
                actionName="Upload a Picture of the Asset"
                keys={formState.photos}
                previewUrls={formState.photoURLs}
                max={6}
                setSelectedKey={setSelectedKey}
                setSelectedPreview={setSelectedPreview}
                setReady={setReady}
              />
            </Grid>
            {!selectedKey && ready && (
              <Grid item>
                <PrimaryText>
                  Click on a picture to crop it (possible only once)
                </PrimaryText>
              </Grid>
            )}
            <Grid item>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={16 / 9}
              >
                <Img src={selectedPreview} />
              </ReactCrop>
            </Grid>
            {selectedKey && (
              <Grid item>
                <Btn
                  onClick={() =>
                    server?.axiosInstance
                      .put("api/host/assets/images/cropPicture", {
                        assetId: formState?._id.toString(),
                        key: selectedKey,
                        crop,
                      })
                      .then(() => toast.success("cropped"))
                      .catch(() => toast.error("crop failed"))
                      .finally(() => {
                        setSelectedPreview(undefined);
                        setSelectedKey(undefined);
                        setCrop(undefined);
                        fetchSpace(formState?._id.toString());
                      })
                  }
                >
                  Save and upload Cropped Version
                </Btn>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Modal>
  );
};
export default PicturesModal;
