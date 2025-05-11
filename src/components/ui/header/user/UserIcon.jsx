import { FiUser } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import classes from "./UserIcon.module.css";

const UserIcon = ({ className }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const containerRef = useRef(null);
    const isHoveringRef = useRef(false);

    const handleMouseEnter = () => {
        isHoveringRef.current = true;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        isHoveringRef.current = false;
        timeoutRef.current = setTimeout(() => {
            if (!isHoveringRef.current) {
                setIsDropdownVisible(false);
            }
        }, 200);
    };

    const handleProfileClick = (e) => {
        // Only navigate if clicking directly on the icon, not on the dropdown
        if (e.target.closest(`.${classes.dropdown_menu}`)) {
            return;
        }
        setIsDropdownVisible(!isDropdownVisible);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${className} ${classes.user_icon_container}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleProfileClick}
        >
            <FiUser />
            {isDropdownVisible && <UserDropdown />}
        </div>
    );
};

export default UserIcon;