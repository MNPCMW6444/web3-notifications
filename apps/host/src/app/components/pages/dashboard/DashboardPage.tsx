import {
  Container,
  Grid,
  Modal,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SyntheticEvent, useContext, useState } from "react";
import { ChatBubble, Delete, Edit } from "@mui/icons-material";
import {
  ActionModal,
  GenericTable,
  GenericTableProps,
  PrimaryText,
} from "@w3notif/shared-react";
import { ListingsContext } from "../../../context/ListingsContext";
import ProfileForm from "../../forms/ProfileForm";
import { TODO } from "@w3notif/shared";
import SpaceForm from "../../forms/SpaceForm";
import { BookingsContext } from "../../../context/BookingsContext";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (
    _: SyntheticEvent<Element, Event>,
    newValue: number,
  ) => {
    setActiveTab(newValue);
  };

  const { myProfiles, myAssets } = useContext(ListingsContext);
  const { bookings } = useContext(BookingsContext);

  const navigate = useNavigate();

  const tabs: ({ name: string } & GenericTableProps<TODO>)[] = [
    {
      name: "Company Profiles",
      readyData: myProfiles,
      customColumns: [
        { name: "Comapny Name", path: ["companyName"] },
        { name: "Comapny in Hold", path: ["companyInHold"] },
        { name: "Ownership", path: ["owner"] },
        { name: "Contract End Date", path: ["contractEndDate"] },
        { name: "Sublease Permission", path: ["subleasePermission"] },
        { name: "Building", path: ["building"] },
        { name: "No. of Floors", path: ["floor", "length"] },
      ],
      actions: [
        {
          name: "Edit",
          icon: <Edit />,
          modal: (closeModal: () => void, id?: string) => (
            <Modal open>
              <ProfileForm id={id} closeModal={closeModal} />
            </Modal>
          ),
        },
        {
          name: "Delete",
          icon: <Delete />,
          modal: (closeModal: () => void, id?: string) => (
            <ActionModal
              closeModal={closeModal}
              endpoint={`/api/host/companies/delete_company_lease/${id}`}
              method="delete"
              name={<Delete />}
              doingName="Deleting.."
            />
          ),
        },
      ],
      fab: {
        modal: (closeModal: () => void) => (
          <Modal open>
            <ProfileForm closeModal={closeModal} />
          </Modal>
        ),
      },
    },
    {
      name: "Assets",
      readyData: myAssets,
      customColumns: [
        { name: "Type", path: ["assetType"] },
        { name: "Status", path: ["publishingStatus"] },
        { name: "Price", path: ["leaseCondition", "monthlyPrice"] },
        { name: "Description", path: ["assetDescription"] },
        { name: "Floor Number", path: ["floorNumber"] },
        { name: "Room Number", path: ["roomNumber"] },
        { name: "Maximum People Capacity", path: ["peopleCapacity"] },
      ],
      actions: [
        {
          name: "Edit",
          icon: <Edit />,
          modal: (closeModal: () => void, id?: string) => (
            <Modal open>
              <SpaceForm id={id} closeModal={closeModal} />
            </Modal>
          ),
        },
        {
          name: "Delete",
          icon: <Delete />,
          modal: (closeModal: () => void, id?: string) => (
            <ActionModal
              closeModal={closeModal}
              endpoint={`/api/host/assets/delete_asset/${id}`}
              method="delete"
              name={<Delete />}
              doingName="Deleting.."
            />
          ),
        },
      ],
      fab: {
        modal: (closeModal: () => void) => (
          <Modal open>
            <SpaceForm closeModal={closeModal} />
          </Modal>
        ),
      },
    },
    {
      name: "Bookings",
      readyData: bookings,
      customColumns: [
        { name: "Status", path: ["requestStatus"] },
        { name: "Guest", path: ["name"] },
        { name: "Beginning Date", path: ["startDate"] },
        { name: "End Date", path: ["endDate"] },
      ],
      actions: [
        {
          name: "Chat",
          icon: <ChatBubble />,
          modal: ((_: TODO, id?: string) =>
            navigate("/chats?chatId=" + id?.toString())) as TODO,
        },
        /*      {
                name: "Delete",
                icon: <Delete />,
                modal: (closeModal: () => void, id?: string) => (
                  <ActionModal
                    closeModal={closeModal}
                    endpoint={`/api/host/assets/delete_asset/${id}`}
                    method="delete"
                    name={<Delete />}
                    doingName="Deleting.."
                  />
                ),
              },*/
      ],
    },
  ];

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      height="100%"
      width="100%"
      rowSpacing={2}
      wrap="nowrap"
      padding="20px 25px 0 25px"
    >
      <Grid item alignSelf="flex-start">
        <PrimaryText variant="h4" paddingLeft="50px">
          Dashboard
        </PrimaryText>
      </Grid>
      <Grid item width="100%">
        <Container>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile
          >
            {tabs.map(({ name }: TODO) => (
              <Tab key={name} label={name} />
            ))}
          </Tabs>
          <br />
          <GenericTable {...tabs[activeTab]} />
        </Container>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
