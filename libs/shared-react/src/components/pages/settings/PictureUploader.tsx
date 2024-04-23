import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Grid, CircularProgress } from "@mui/material";
import { Btn, Img, PrimaryText, ServerContext } from "../../../";
import styled from "@emotion/styled";

const Input = styled("input")({
  display: "none",
});

interface PictureUploaderProps {
  cb?: () => void;
  endpoint: string;
  actionName: string;
  max?: number;
  previewUrls?: string[];
  keys?: string[];
  setSelectedKey?: Dispatch<SetStateAction<string | undefined>>;
  setSelectedPreview?: Dispatch<SetStateAction<string | undefined>>;
  setReady?: Dispatch<SetStateAction<boolean>>;
}

export const PictureUploader = ({
  cb,
  endpoint,
  actionName,
  max = 1,
  previewUrls = [],
  keys = [],
  setSelectedKey,
  setSelectedPreview,
  setReady,
}: PictureUploaderProps) => {
  const server = useContext(ServerContext);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(previewUrls);

  useEffect(() => {
    setReady && setReady(files.length === 0);
  }, [setReady, files]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFilesArray = Array.from(event.target.files);
      let updatedFiles = [...files, ...selectedFilesArray];

      if (updatedFiles.length > max) {
        updatedFiles = updatedFiles.slice(0, max);
      }

      setFiles(updatedFiles);

      const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length === 0) {
      alert("Please select a file.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    if (max === 1 && files[0]) {
      formData.append("file", files[0]);
    } else {
      files.forEach((file) => {
        formData.append("files", file); // Corrected
      });
    }

    try {
      await server?.axiosInstance.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFiles([]);
      cb && cb();
    } catch (error) {
      console.log("Upload failed", error);
      alert("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = () => {
    setFiles([]);
    setPreviews(previewUrls);
  };

  return (
    <Grid container direction="column" rowSpacing={2}>
      <Grid item container alignItems="center" columnSpacing={2}>
        <Grid item>
          <PrimaryText variant="h6">{actionName}: </PrimaryText>
        </Grid>
        <Grid item>
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple={max > 1}
                type="file"
                onChange={handleFileChange}
              />
              <Btn component="span" disabled={isLoading}>
                Choose File
              </Btn>
            </label>
            <Btn
              type="submit"
              disabled={isLoading || files.length === 0}
              sx={{ ml: 2 }}
            >
              Upload
            </Btn>
            <Btn
              color="error"
              variant="outlined"
              onClick={handleRevert}
              disabled={isLoading || files.length === 0}
              sx={{ ml: 2 }}
            >
              Revert
            </Btn>
            {isLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
          </form>
        </Grid>
      </Grid>
      {previews.length > 0 &&
        previews.map((preview, index) => (
          <Grid item>
            <Img
              onClick={() => {
                setSelectedKey && setSelectedKey(keys[index]);
                setSelectedPreview && setSelectedPreview(preview);
              }}
              key={index}
              src={preview}
              alt="Preview"
              style={{ width: 160, height: 90, marginRight: 10 }}
            />
          </Grid>
        ))}
    </Grid>
  );
};
