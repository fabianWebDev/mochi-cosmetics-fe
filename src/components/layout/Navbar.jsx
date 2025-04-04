import SearchBar from '../ui/SearchBar';
import MainMenu from '../ui/MainMenu';
import PageHeader from '../ui/PageHeader';
import NavbarMobile from './NavbarMobile';

const Navbar = () => {
    return (
        <>
            <NavbarMobile />
            <PageHeader />
            <div className="container">
                <MainMenu />
                <SearchBar />
            </div >
        </>
    );
}

export default Navbar;
