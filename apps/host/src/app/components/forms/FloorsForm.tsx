import { Dispatch, SetStateAction, useState } from "react";
import { Company, Floor, TODO } from "@w3notif/shared";
import { Grid, Modal } from "@mui/material";
import {
  CloseButton,
  ActionModal,
  GenericTable,
  PrimaryText,
  Btn,
} from "@w3notif/shared-react";
import FloorForm from "./FloorForm";
import { Delete } from "@mui/icons-material";

interface FloorsModalProps {
  formState: Company;
  handleUpdate: (updatedState: Company) => Promise<void>;
  setFloorsModal: Dispatch<SetStateAction<boolean>>;
}

const FloorsForm = ({
  formState,
  handleUpdate,
  setFloorsModal,
}: FloorsModalProps) => {
  const [floors, setFloors] = useState<Floor[]>(formState.floor || []);
  const [newFloor, setNewFloor] = useState<Floor>();

  return newFloor ? (
    <FloorForm
      formState={newFloor}
      setFormState={setNewFloor}
      setFloors={setFloors}
    />
  ) : (
    <Modal open>
      <Grid
        id="23423423423423"
        height="73%"
        width="72%"
        marginLeft="14%"
        marginTop="7%"
        paddingRight="8%"
        overflow="scroll"
        item
        container
        direction="column"
        rowSpacing={4}
        alignItems="center"
        wrap="nowrap"
        bgcolor={(theme) => theme.palette.background.default}
      >
        <Grid
          item
          container
          direction="column"
          rowSpacing={4}
          sx={{ overflowX: "scroll" }}
          wrap="nowrap"
          alignItems="center"
          padding="2%"
          width="80%"
          marginLeft="10%"
          bgcolor={(theme) => theme.palette.background.default}
          overflow="scroll"
        >
          <Grid item>
            <CloseButton onClick={() => setFloorsModal(false)} />
          </Grid>
          <Grid item>
            <PrimaryText variant="h4">Floors:</PrimaryText>
          </Grid>
          {!newFloor && (
            <Grid item>
              <Btn onClick={() => setNewFloor({ floorNumber: "1a" })}>
                Add a Floor
              </Btn>
            </Grid>
          )}
          <Grid item>
            <GenericTable
              readyData={floors as TODO}
              customColumns={[
                { name: "Number", path: ["floorNumber"] },
                { name: "Floor Amenities", path: ["floorAmenities"] },
                { name: "Kitchen Amenities", path: ["kitchenAmenities"] },
              ]}
              actions={[
                /*  {
                    name: "Edit",
                    icon: <Edit />,
                    modal: (closeModal: () => void, id?: string) => (
                      <Modal open>
                        <FloorForm
                          formState={floors.find(
                            ({ floorNumber }) => floorNumber === id,
                          )}
                          setFloors={setFloors}
                          floorNumberId={id}
                          closeModal={closeModal}
                          tempFloors={floors}
                        />
                      </Modal>
                    ),
                  },*/
                {
                  name: "Delete",
                  icon: <Delete />,
                  modal: (closeModal: () => void, id?: string) => (
                    <ActionModal
                      closeModal={closeModal}
                      endpoint={() => {
                        setFloors((p) =>
                          p.filter(({ floorNumber }) => floorNumber !== id),
                        );
                        closeModal();
                      }}
                      method="delete"
                      name={<Delete />}
                      doingName="Deleting.."
                    />
                  ),
                },
              ]}
              customRowId="floorNumber"
            />
          </Grid>
          <Grid item>
            <Btn
              onClick={() => {
                handleUpdate({ ...formState, floor: floors } as Company);
                setFloorsModal(false);
              }}
            >
              Save
            </Btn>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};
export default FloorsForm;
