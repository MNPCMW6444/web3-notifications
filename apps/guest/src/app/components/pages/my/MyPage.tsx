import { GenericTable } from "@w3notif/shared-react";

const MyPage = () => {
  return (
    <GenericTable
      endpoint="api/bookings"
      customColumns={[{ path: ["requestStatus"], name: "Status" }]}
      actions={[]}
    />
  );
};

export default MyPage;
