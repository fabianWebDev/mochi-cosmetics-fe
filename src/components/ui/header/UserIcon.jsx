import { FiUser } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import classes from "./HeaderIcons.module.css";

const UserIcon = ({ className }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = (e) => {
        // Only navigate if clicking directly on the icon, not on the dropdown
        if (e.target.closest(`.${classes.dropdown_menu}`)) {
            return;
        }
        navigate('/profile');
    };

    return (
        <div
            className={`${className} ${classes.user_icon_container}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleProfileClick}
        >
            <FiUser />
            {isHovered && <UserDropdown />}
        </div>
    );
};

export default UserIcon;