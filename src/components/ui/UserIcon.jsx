import { FiUser } from "react-icons/fi";

const UserIcon = ({ onClick, className }) => {
  return (
    <div className={className}>
      <FiUser />
    </div>
  );
};

export default UserIcon;