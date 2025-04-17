import classes from './PageHeader.module.css';
import HeaderLogo from './HeaderLogo';
import HeaderIcons from './HeaderIcons';

const PageHeader = () => {

    return (
        <div className={classes.page_header}>
            <div className={`${classes.logo_container} col col-sm-6 col-md-6`}>
                <HeaderLogo />
            </div>
            <div className={`${classes.header_icons} col col-sm-4 col-md-4`}>
                <div className={`${classes.header_icons} col`}>
                </div>
                <div className={`${classes.header_icons} col`}>
                    <HeaderIcons />
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
