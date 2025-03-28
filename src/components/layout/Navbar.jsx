import SearchBar from '../ui/SearchBar';
import MainMenu from '../ui/MainMenu';
import PageHeader from '../ui/PageHeader';

function Navbar() {
    return (
        <>
            <PageHeader />
            <div className="container">
                <MainMenu />
                <SearchBar />
            </div >
        </>
    );
}

export default Navbar;
