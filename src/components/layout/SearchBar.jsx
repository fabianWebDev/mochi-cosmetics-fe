import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <button type="submit">Buscar</button>
        </form>
    );
};

export default SearchBar;
