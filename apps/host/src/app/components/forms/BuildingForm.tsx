import { Grid, MenuItem, Modal, Select, TextField } from "@mui/material";
import {
  axiosErrorToaster,
  Btn,
  CloseButton,
  PrimaryText,
  renderSwitch,
  renderSwitchGroup,
  renderTextField,
  ServerContext,
} from "@w3notif/shared-react";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  AmenityAccess,
  AmenityType,
  Building,
  createEditBuildingReq,
  format,
  TODO,
  AccessedAmenity,
} from "@w3notif/shared";
import { ListingsContext } from "../../context/ListingsContext";

interface BuildingFormModalProps {
  setBuildingForm: Dispatch<SetStateAction<boolean>>;
}

const BuildingForm = ({ setBuildingForm }: BuildingFormModalProps) => {
  const [formState, setFormState] = useState<createEditBuildingReq>({
    buildingName: "New",
    address: {
      street: "Please",
      city: "Enter",
      country: "the Address",
    },
  } as TODO);
  const server = useContext(ServerContext);
  const { amenities } = useContext(ListingsContext);

  const updateNestedObject = (obj: TODO, path: string[], value: TODO) => {
    if (path.length === 0) return obj;
    if (path.length === 1) {
      obj[path[0]] = value;
      return obj;
    }

    const [first, ...rest] = path;
    if (obj[first] === undefined || typeof obj[first] !== "object") {
      obj[first] = {};
    }

    obj[first] = updateNestedObject(obj[first], rest, value);
    return obj;
  };

  const handleChange = (path: string[], value: string | Date | boolean) => {
    if (!formState) return;

    // Create a copy of the current state to avoid directly mutating it
    const prevStateCopy = { ...formState };
    const updatedFormState = updateNestedObject(prevStateCopy, path, value);

    setFormState(updatedFormState);
  };

  // Exam
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleLocationChange = async (event: TODO) => {
    const value = event.target.value;
    setLocation(value);

    if (value.length > 2) {
      try {
        if (server) {
          const { data } = await server.axiosInstance.get(
            `/api/geo/autocomplete-address/${value}`,
          );
          setSuggestions(data);
        } else throw new Error("No server");
      } catch (error) {
        console.log("Error fetching autocomplete suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const renderSuggestions = () => {
    return suggestions.map((suggestion: TODO, index) => (
      <div
        key={index}
        onClick={async () => {
          setLocation(suggestion.description);
          const { main_text, primary_text, secondary_text } =
            suggestion.structured_formatting;

          const cords = await server?.axiosInstance.get(
            "api/geo/getLocation/" + suggestion.description,
          );

          setFormState(((prev: Building) => {
            return {
              ...prev,
              address: {
                street: primary_text ? main_text : primary_text,
                city: primary_text?.split(", ")[0] || main_text,
                country: primary_text?.split(", ")[1] || secondary_text,
                geoLocalisation: {
                  type: "Point",
                  coordinates: Object.values(cords?.data),
                },
              },
            };
          }) as TODO);
          setSuggestions([]);
        }}
      >
        <MenuItem>{suggestion.description}</MenuItem>
      </div>
    ));
  };

  return (
    <Modal open>
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
          <CloseButton onClick={() => setBuildingForm(false)} />
        </Grid>
        <Grid item>
          <PrimaryText variant="h4">Building</PrimaryText>
        </Grid>
        <Grid item>
          {renderTextField(formState, handleChange as TODO, "buildingName")}
        </Grid>
        <Grid item>
          <TextField
            id="autocomplete"
            label="Address"
            variant="outlined"
            fullWidth
            value={location}
            onChange={handleLocationChange}
          />
          {renderSuggestions()}
        </Grid>
        <Grid item>
          {renderSwitchGroup<createEditBuildingReq, AccessedAmenity[]>(
            formState,
            ["buildingAmenities"],
            format("buildingAmenities"),
            setFormState,
            amenities
              .filter(({ type }) => type === AmenityType.Building)
              .map(({ name }) => ({
                label: format(name),
                value: name,
              })),
            (value: string) =>
              formState?.buildingAmenities?.find(
                (item: TODO) => item.name === value,
              ) && (
                <Select
                  label={"Access"}
                  value={
                    formState?.buildingAmenities?.find(
                      (item: TODO) => item.name === value,
                    )?.access || Object.values(AmenityAccess)[0]
                  }
                  onChange={
                    ((event: React.ChangeEvent<{ value: unknown }>) => {
                      setFormState((prevState: createEditBuildingReq) => {
                        const newState: TODO = { ...prevState };
                        let targetArray: TODO = newState;
                        ["buildingAmenities"].slice(0, -1).forEach((key) => {
                          if (!targetArray[key]) targetArray[key] = {};
                          targetArray = targetArray[key];
                        });
                        const finalKey = ["buildingAmenities"][
                          ["buildingAmenities"].length - 1
                        ];
                        const itemIndex = targetArray[finalKey].findIndex(
                          (item: TODO) => item.name === value,
                        );
                        if (itemIndex !== -1) {
                          targetArray[finalKey][itemIndex].access =
                            event.target.value;
                        }
                        return newState;
                      });
                    }) as TODO
                  }
                >
                  {Object.values(AmenityAccess).map(
                    (value) =>
                      value && (
                        <MenuItem key={value} value={value}>
                          {format(value)}
                        </MenuItem>
                      ),
                  )}
                </Select>
              ),
          )}
        </Grid>
        {/* <Grid item>
          {renderSwitchGroupComplex(
            formState,
            format("buildingAccess"),
            ["buildingAccess", "days_of_week"],
            setFormState as Dispatch<
              SetStateAction<createEditBuildingReq | undefined>
            >,
            handleChange ,
          )}
        </Grid>*/}
        <Grid item>
          {renderTextField(
            formState,
            handleChange as TODO,
            "buildingDescription",
            {
              multiline: true,
            },
          )}
        </Grid>
        <Grid item>
          {renderSwitch(formState, handleChange, ["doorman"], {
            label: { truthy: format("doorman") + " ?" },
          })}
        </Grid>
        <Grid item>
          {renderSwitch(formState, handleChange, ["security"], {
            label: { truthy: format("security") + " ?" },
          })}
        </Grid>
        <Grid item>
          {renderSwitch(formState, handleChange, ["vip_service"], {
            label: { truthy: format("vip_service") + " ?" },
          })}
        </Grid>
        <Grid item>
          <Btn
            onClick={async () => {
              const create = await server?.axiosInstance.post(
                "api/host/buildings/get_building_id",
              );
              create &&
                server?.axiosInstance
                  .put("api/host/buildings/add_building", {
                    building_id: create.data._id,
                    ...formState,
                  })
                  .then(() => setBuildingForm(false))
                  .catch((e) => axiosErrorToaster(e));
            }}
          >
            Save
          </Btn>
        </Grid>
      </Grid>
    </Modal>
  );
};
export default BuildingForm;
