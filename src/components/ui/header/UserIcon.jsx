import { FiUser } from "react-icons/fi";
import { useState } from "react";
import UserDropdown from "./UserDropdown";
import classes from "./HeaderIcons.module.css";
import { Link } from "react-router-dom";

const UserIcon = ({ className }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link to="/profile">
            <div
                className={`${className} ${classes.user_icon_container}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
        >
            <FiUser />
                {isHovered && <UserDropdown />}
            </div>
        </Link>
    );
};

export default UserIcon;