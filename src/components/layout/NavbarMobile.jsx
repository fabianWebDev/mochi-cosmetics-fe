import MainMenu from '../ui/MainMenu';
import PageHeader from '../ui/PageHeader';
import SearchBar from '../ui/SearchBar';

const NavbarMobile = () => {
    return (
        <>
            <div className="row">
                <div className='col-6'><PageHeader /></div>
                <div className='col-6'><MainMenu /></div>
            </div>
            <div className='row'>
                <div className='col-8'><SearchBar /></div>
            </div>
        </>
    )
}

export default NavbarMobile;
