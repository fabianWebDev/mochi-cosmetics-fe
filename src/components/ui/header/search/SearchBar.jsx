import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from './SearchBar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm) {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="col p-1">
            <div className={classes.search_container}>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder=""
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${classes.search_input}`}
                    />
                    <button type="submit" className={classes.search_button}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.search_icon} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SearchBar;
