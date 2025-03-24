import SearchBar from '../ui/SearchBar';
import MainMenu from '../ui/MainMenu';
import PageHead from '../ui/PageHead';

function Navbar() {
    return (
        <div className="container">
            <PageHead />
            <MainMenu />
            <SearchBar />
        </div >
    );
}

export default Navbar;
