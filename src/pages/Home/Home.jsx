import { Hero } from '../../components/ui/hero';
import ProductCarousel from '../../components/ui/carousel/ProductCarousel';
import CategoriesGrid from '../../components/ui/layout/CategoriesGrid';
import MainFrame from '../../components/ui/layout/MainFrame';
import SecondaryFrame from '../../components/ui/layout/SecondaryFrame';

const Home = () => {
    return (
        <MainFrame>
            <SecondaryFrame>
                <Hero />
                <ProductCarousel />
                <CategoriesGrid />
            </SecondaryFrame>
        </MainFrame>
    );
}

export default Home; 