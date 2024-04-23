import {Container, Tab, Tabs, useMediaQuery, useTheme} from "@mui/material";
import {SyntheticEvent, useState} from "react";
import {Approval, Delete, Edit} from "@mui/icons-material";
import {
  ActionModal,
  GenericTable,
  GenericTableProps,
} from "@w3notif/shared-react";
import AmenityForm from "../../forms/AmenityForm";
import {TODO} from "@w3notif/shared";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: number,
  ) => {
    setActiveTab(newValue);
  };

  const tabs: ({ name: string } & GenericTableProps<TODO>)[] = [
    {name: "All Listings", endpoint: "api/admin/listings/all", actions: []},
    {
      name: "Pending Listings",
      endpoint: "api/admin/listings/pending",
      customColumns: [
        {name: "Status", path: ["publishingStatus"]},
        {name: "Type", path: ["assetType"]},
      ],
      actions: [
        {
          name: "Approve",
          icon: <Approval/>,
          modal: (closeModal: () => void, id?: string) => (
            <ActionModal
              closeModal={closeModal}
              endpoint={"api/admin/listings/approve/" + id}
              method="put"
              name={<Approval/>}
              doingName="Approving..."
            />
          ),
        },
      ],
    },
    {
      name: "Amenities",
      endpoint: "api/amenities",
      customColumns: [
        {name: "Name", path: ["name"]},
        {name: "Type", path: ["type"]},
      ],
      actions: [
        {
          name: "Edit",
          icon: <Edit/>,
          modal: (closeModal: () => void, id?: string) => (
            <AmenityForm closeModal={closeModal} editId={id}/>
          ),
        },
        {
          name: "Delete",
          icon: <Delete/>,
          modal: (closeModal: () => void, id?: string) => (
            <ActionModal
              closeModal={closeModal}
              endpoint={"api/admin/amenities/" + id}
              method="delete"
              name={<Delete/>}
              doingName="Deleting.."
            />
          ),
        },
      ],
      fab: {
        modal: (closeModal: () => void) => (
          <AmenityForm closeModal={closeModal}/>
        ),
      },
    },
    {
      name: "Buildings",
      endpoint: "api/host/buildings/get_buildings_list",
      customColumns: [
        {name: "Name", path: ["name"]},
        {name: "Address", path: ["address"]},
      ],
      actions: [
        /* {
           name: "Edit",
           icon: <Edit />,
           modal: (closeModal: () => void, id?: string) => (
             <BuildingForm setBuildingForm={}/>
           ),
         },*/
        {
          name: "Delete",
          icon: <Delete/>,
          modal: (closeModal: () => void, id?: string) => (
            <ActionModal
              closeModal={closeModal}
              endpoint={"api/admin/buildings/" + id}
              method="delete"
              name={<Delete/>}
              doingName="Deleting.."
            />
          ),
        },
      ],
    },
  ];

  return (
    <Container>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons={isMobile ? "auto" : false}
        allowScrollButtonsMobile
      >
        {tabs.map(({name}) => (
          <Tab key={name} label={name}/>
        ))}
      </Tabs>
      <br/>
      <br/>
      <br/>
      <GenericTable {...tabs[activeTab]} />
    </Container>
  );
};

export default HomePage;
