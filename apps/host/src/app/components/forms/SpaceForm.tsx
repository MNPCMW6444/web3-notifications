import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import { Grid } from "@mui/material";
import {
  axiosErrorToaster,
  PrimaryText,
  renderDropdown,
  renderSwitchGroup,
  renderTextField,
  ServerContext,
  CloseAndSave,
  Btn,
} from "@w3notif/shared-react";
import {
  AcceptedLeaseType,
  Asset,
  Status,
  AssetType,
  Company,
  Floor,
  format,
  StartAssetReq,
  TODO,
} from "@w3notif/shared";
import { ListingsContext } from "../../context/ListingsContext";
import PicturesModal from "./PicturesModal";

interface SpaceFormProps {
  id?: string;
  closeModal?: () => void;
}

const SpaceForm = ({ id, closeModal }: SpaceFormProps) => {
  const [picturesModal, setPicturesModal] = useState(false);
  const [formState, setFormState] = useState<Asset>();
  const server = useContext(ServerContext);
  const { myProfiles } = useContext(ListingsContext);
  const fetchSpace = useCallback(
    async (id: string) => {
      try {
        const res = await server?.axiosInstance.get(
          `/api/host/assets/asset_detail/${id}`,
        );
        setFormState(res?.data);
      } catch (e) {
        axiosErrorToaster(e);
      }
    },
    [server?.axiosInstance],
  );

  const creationInitiatedRef = useRef(false);

  const createNew = useCallback(async () => {
    if (!creationInitiatedRef.current && myProfiles) {
      creationInitiatedRef.current = true;
      try {
        const res = await server?.axiosInstance.post<TODO, TODO, StartAssetReq>(
          "api/host/assets/get_asset_id",
          { companyId: myProfiles[0]._id },
        );
        const newAssetId = res?.data?._id.toString();
        return newAssetId;
      } catch (e) {
        axiosErrorToaster(e);
      }
    } else if (!myProfiles) {
      toast.error("Create your first profile first");
    }
  }, [myProfiles, server?.axiosInstance]);

  const { search } = useLocation();

  useEffect(() => {
    const init = async () => {
      const queryId = new URLSearchParams(search).get("id");
      const effectiveId = id || queryId;
      if (!effectiveId) {
        const newId = await createNew();
        if (newId) fetchSpace(newId);
      } else {
        fetchSpace(effectiveId);
      }
    };
    init();
  }, [createNew, fetchSpace, id, search]);

  const handleUpdate = useCallback(
    async (updatedState: Asset) => {
      try {
        const res = await server?.axiosInstance.put(
          `/api/host/assets/edit_asset/${updatedState._id}`,
          updatedState,
        );
        toast.success(res?.data.msg);
      } catch (error) {
        axiosErrorToaster(error);
      }
    },
    [server?.axiosInstance],
  );

  const debouncedUpdate = useMemo(
    () => debounce(handleUpdate, 500),
    [handleUpdate],
  );

  const handleChange = (
    path: keyof Asset | string[],
    value: string | Date | boolean,
  ) => {
    if (formState) {
      setFormState((prevState: Asset | undefined) => {
        const updateNestedObject = (
          obj: TODO,
          pathArray: string[],
          value: TODO,
        ): TODO => {
          const [first, ...rest] = pathArray;
          if (rest.length === 0) {
            obj[first] = value;
          } else {
            if (!obj[first]) obj[first] = {};
            updateNestedObject(obj[first], rest, value);
          }
          return obj;
        };

        const pathArray = Array.isArray(path) ? path : [path];

        const updatedState = updateNestedObject(
          prevState ? { ...prevState } : {},
          pathArray,
          value,
        );

        debouncedUpdate(updatedState as Asset)?.then();

        return updatedState;
      });
    }
  };

  return (
    <>
      {picturesModal && (
        <PicturesModal
          setPicturesModal={setPicturesModal}
          fetchSpace={fetchSpace}
          formState={formState}
        />
      )}
      <Grid
        height="80%"
        width="80%"
        marginLeft="10%"
        marginTop="5%"
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
          <CloseAndSave onClick={() => closeModal && closeModal()} />
        </Grid>
        {formState?._id ? (
          <>
            <Grid item>
              <PrimaryText variant="h4">List your Space</PrimaryText>
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={2}
            >
              <Grid item>
                <PrimaryText>Profile: </PrimaryText>
              </Grid>
              {myProfiles && (
                <Grid item>
                  {renderDropdown(
                    formState,
                    handleChange,
                    "companyId",
                    format("leasingCompany"),
                    myProfiles.map(({ _id, companyName }) => ({
                      value: _id,
                      label: companyName,
                    })),
                  )}
                </Grid>
              )}
            </Grid>
            <Grid item>
              {renderTextField(formState, handleChange, "assetDescription", {
                label: "Description",
                multiline: true,
              })}
            </Grid>
            <Grid item>
              {renderTextField(formState, handleChange, "roomNumber")}
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={2}
            >
              <Grid item>
                <PrimaryText>Space Type: </PrimaryText>
              </Grid>
              <Grid item>
                {renderDropdown(
                  formState,
                  handleChange,
                  "assetType",
                  format("assetType"),
                  Object.values(AssetType).map((value) => ({
                    value,
                    label: format(value),
                  })),
                )}
              </Grid>
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={2}
            >
              <Grid item>
                <PrimaryText>Floor Number: </PrimaryText>
              </Grid>
              {myProfiles && formState && (
                <Grid item>
                  {renderDropdown(
                    formState,
                    handleChange,
                    "floorNumber",
                    format("floorNumber"),
                    myProfiles
                      .find(
                        ({ _id }: Company) =>
                          _id.toString() === formState?.companyId.toString(),
                      )
                      ?.floor?.map(({ floorNumber }: Floor) => ({
                        value: floorNumber,
                        label: format(floorNumber),
                      })) || [
                      {
                        value: "no floors",
                        label: "no floors",
                      },
                    ],
                  )}
                </Grid>
              )}
            </Grid>
            <Grid item>
              <PrimaryText>Lease Condition:</PrimaryText>
            </Grid>
            <Grid item>
              {renderSwitchGroup<Asset, string>(
                formState,
                ["leaseCondition", "leaseType"],
                "Accepted Lease Types",
                setFormState as TODO,
                Object.values(AcceptedLeaseType).map((value) => ({
                  value,
                  label: format(value),
                })),
              )}
            </Grid>
            <Grid item>
              {renderTextField<Asset>(
                formState,
                handleChange,
                ["leaseCondition", "monthlyPrice"],
                { number: true },
              )}
            </Grid>
            <Grid item>
              {renderTextField<Asset>(
                formState,
                handleChange,
                ["leaseCondition", "minLeaseContract"],
                { number: true },
              )}
            </Grid>
            <Grid item>
              {renderTextField(formState, handleChange, "peopleCapacity", {
                number: true,
                label: "Maximum People Capacity",
              })}
            </Grid>
            <Grid item>
              <Btn onClick={() => setPicturesModal(true)}>Manage Pictures</Btn>
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={2}
            >
              <Grid item>
                <PrimaryText variant="h5">Status:</PrimaryText>
              </Grid>
              <Grid item>
                <PrimaryText variant="h5">
                  {formState?.publishingStatus || "Draft"}
                </PrimaryText>
              </Grid>
              <Grid item>
                <Btn
                  disabled={
                    formState?.publishingStatus === Status.Active ||
                    formState?.publishingStatus === Status.Pending ||
                    formState?.publishingStatus === Status.Suspended
                  }
                  onClick={() =>
                    server?.axiosInstance
                      .put(
                        "api/host/assets/publish_asset/" +
                          formState?._id.toString(),
                      )
                      .finally(() => fetchSpace(formState?._id.toString()))
                  }
                >
                  Publish
                </Btn>
              </Grid>
              <Grid item>
                <Btn
                  disabled={
                    true || formState?.publishingStatus !== Status.Pending
                  }
                  onClick={() =>
                    server?.axiosInstance
                      .put(
                        "api/host/assets/withdraw_asset/" +
                          formState?._id.toString(),
                      )
                      .finally(() => fetchSpace(formState?._id.toString()))
                  }
                >
                  Withdraw
                </Btn>
              </Grid>
              <Grid item>
                <Btn
                  disabled={
                    true || formState?.publishingStatus !== Status.Active
                  }
                  onClick={() =>
                    server?.axiosInstance
                      .put(
                        "api/host/assets/pause_asset/" +
                          formState?._id.toString(),
                      )
                      .finally(() => fetchSpace(formState?._id.toString()))
                  }
                >
                  Pause
                </Btn>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid item>
            <PrimaryText padded>
              {creationInitiatedRef.current ? "Error" : "Loading..."}
            </PrimaryText>
          </Grid>
        )}
      </Grid>
    </>
  );
};
export default SpaceForm;
