import SearchBar from '../ui/header/SearchBar';
import MainMenu from '../ui/header/MainMenu';
import PageHeader from '../ui/header/PageHeader';

const Navbar = () => {
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
