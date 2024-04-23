import { useContext, useState, useEffect, useMemo } from "react";
import {
  Tabs,
  Tab,
  Container,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NotificationsTab } from "./NotificationsTab";
import { AccountTab } from "./AccountTab";
import { Logout, Notifications } from "@mui/icons-material";
import { AuthContext } from "../../../";
import { TODO } from "@w3notif/shared";

interface NotificationsTabProps {
  isGuest?: boolean;
}

export const SettingPage = ({ isGuest }: NotificationsTabProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { user, profilePictureUrl, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuData = useMemo(
    () => [
      {
        name: "Manage Account",
        icon: (
          <Avatar alt={user?.name || "username"} src={profilePictureUrl}>
            {user?.name ? user?.name[0] : "?"}
          </Avatar>
        ),
        content: <AccountTab />,
        disabled: false,
      },
      {
        name: "Notifications",
        icon: <Notifications />,
        content: <NotificationsTab isGuest={isGuest} />,
        disabled: false,
      },
      {
        name: "Logout",
        icon: <Logout />,
        action: logout,
        disabled: false,
      },
    ],
    [logout, profilePictureUrl, user?.name, isGuest],
  );

  const handleTabChange = (_: TODO, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (menuData[activeTab].action) {
      (menuData[activeTab].action as () => void)();
    }
  }, [menuData, activeTab]);

  return (
    <Container>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons={isMobile ? "auto" : false}
        allowScrollButtonsMobile
      >
        {menuData.map((item, index) => (
          <Tab
            key={index}
            label={item.name}
            icon={item.icon}
            iconPosition="start"
            disabled={item.disabled}
          />
        ))}
      </Tabs>
      <br />
      <br />
      <br />
      {menuData[activeTab].content}
    </Container>
  );
};
