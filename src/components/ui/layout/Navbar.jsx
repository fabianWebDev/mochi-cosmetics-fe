import SearchBar from '../header/search/SearchBar';
import MainMenu from '../header/menu/MainMenu';
import PageHeader from '../header/main/PageHeader';

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
