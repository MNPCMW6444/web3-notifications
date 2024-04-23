import { Grid } from "@mui/material";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  axiosErrorToaster,
  Btn,
  CloseAndSave,
  MICO,
  PrimaryText,
  renderDatePicker,
  renderDropdown,
  renderSwitch,
  renderTextField,
  ServerContext,
} from "@w3notif/shared-react";
import { useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { Add } from "@mui/icons-material";
import BuildingForm from "./BuildingForm";
import { Company, TODO, format } from "@w3notif/shared";
import { ListingsContext } from "../../context/ListingsContext";
import FloorsForm from "./FloorsForm";

interface ProfileFormProps {
  id?: string;
  closeModal?: () => void;
}

const ProfileForm = ({ id, closeModal }: ProfileFormProps) => {
  const [formState, setFormState] = useState<Company>();
  const server = useContext(ServerContext);
  const { buildings } = useContext(ListingsContext);

  const creationInitiatedRef = useRef(false);

  const fetchProfile = useCallback(
    async (profileId: string) => {
      try {
        const res = await server?.axiosInstance.get(
          `/api/host/companies/get_company_lease/${profileId}`,
        );
        setFormState(res?.data.findCompany);
      } catch (e) {
        axiosErrorToaster(e);
      }
    },
    [server?.axiosInstance],
  );

  const createProfile = useCallback(async () => {
    if (!creationInitiatedRef.current) {
      creationInitiatedRef.current = true;
      try {
        const res = await server?.axiosInstance.post(
          "api/host/companies/create_company_id",
        );
        const newAssetId = res?.data?._id.toString();
        fetchProfile(newAssetId);
      } catch (e) {
        axiosErrorToaster(e);
      }
    }
  }, [fetchProfile, server?.axiosInstance]);

  const { search } = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(search);
    const urlId = query.get("id");
    const effectiveId = id || urlId;
    if (!effectiveId) {
      createProfile();
    } else {
      fetchProfile(effectiveId);
    }
  }, [createProfile, fetchProfile, search, id]);

  const handleUpdate = useCallback(
    async (updatedState: Company) => {
      try {
        const res = await server?.axiosInstance.put(
          "/api/host/companies/edit_company_lease/" +
            updatedState._id.toString(),
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

  const handleChange = (name: string, value: string | Date | boolean) => {
    formState &&
      setFormState(((prevState: Company) => {
        const updatedState: Partial<Company> = { ...prevState, [name]: value };
        debouncedUpdate(updatedState as Company)?.then();
        return updatedState;
      }) as TODO);
  };

  const [buildingForm, setBuildingForm] = useState(false);
  const [floorsModal, setFloorsModal] = useState(false);

  return (
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
      {buildingForm && <BuildingForm setBuildingForm={setBuildingForm} />}
      {floorsModal && formState && (
        <FloorsForm
          formState={formState}
          setFloorsModal={setFloorsModal}
          handleUpdate={handleUpdate}
        />
      )}
      {formState?._id ? (
        <>
          <Grid item>
            <PrimaryText variant="h4">Company Profile</PrimaryText>
          </Grid>
          <Grid item>
            {renderTextField(formState, handleChange as TODO, "companyName")}
          </Grid>
          <Grid item>
            {renderTextField(formState, handleChange as TODO, "companyInHold")}
          </Grid>
          <Grid item>
            {renderSwitch(formState, handleChange as TODO, ["owner"], {
              label: { truthy: "I am the owner of the space" },
            })}
          </Grid>
          <Grid item>
            {renderSwitch(formState, handleChange as TODO, ["owner"], {
              label: { truthy: "I rent the space" },
              negative: true,
            })}
          </Grid>
          <Grid item>
            {renderDatePicker(
              formState,
              handleChange as TODO,
              "contractEndDate",
              "Contract End Date",
            )}
          </Grid>
          <Grid item>
            {renderSwitch(
              formState,
              handleChange as TODO,
              ["subleasePermission"],
              {
                label: { truthy: "I have a legal sublease permission" },
              },
            )}
          </Grid>
          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            columnSpacing={2}
          >
            <Grid item>
              <PrimaryText>Building: </PrimaryText>
            </Grid>
            <Grid item>
              {renderDropdown(
                formState.building ? formState : { building: "asdasd" },
                handleChange as TODO,
                "building",
                format("building"),
                buildings,
              )}
            </Grid>
            <Grid item>
              <Btn onClick={() => setBuildingForm(true)}>
                <MICO>
                  <Add />
                </MICO>
                Other
              </Btn>
            </Grid>
          </Grid>
          <Grid item>
            <Btn onClick={() => setFloorsModal(true)}>Manage Floors</Btn>
          </Grid>
        </>
      ) : (
        <Grid item>
          <PrimaryText padded>
            {formState?._id ? "Error" : "Loading..."}
          </PrimaryText>
        </Grid>
      )}
    </Grid>
  );
};

export default ProfileForm;
