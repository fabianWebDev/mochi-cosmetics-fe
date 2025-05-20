import classes from './PageHeader.module.css';
import HeaderLogo from '../logo/HeaderLogo';
import HeaderIcons from '../icons/HeaderIcons';
import MainMenu from '../menu/MainMenu';
import SearchBar from '../search/SearchBar';

const PageHeader = () => {

    return (
        <div className={`${classes.page_header} row d-flex justify-content-between g-0`}>
            <div className={`${classes.logo_container} col`}>
                <HeaderLogo />
            </div>
            <div className={`${classes.menu_container} col justify-content-center`}>
                <SearchBar />
            </div>
            <div className={`${classes.header_icons} col`}>
                <HeaderIcons />
            </div>
        </div>

    );
};

export default PageHeader;
