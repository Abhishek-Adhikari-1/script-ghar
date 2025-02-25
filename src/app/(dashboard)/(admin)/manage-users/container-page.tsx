import { UsersDataTable } from "@/components/dashboard/admin/manage-users/users-table";
import { PropsUserList } from "./page";

const ContainerPage = ({ userList }: { userList: PropsUserList[] }) => {
  return (
    <div className="backdrop-blur-sm bg-card shadow-sm box-border w-full px-2 rounded-md">
      <UsersDataTable userList={userList} />
    </div>
  );
};

export default ContainerPage;
