import { Layout } from '../../components';
const { Hero } = Layout;
import { Hero2 } from '../../components/ui/hero';
import ProductCarousel from '../../components/ui/carousel/ProductCarousel';
import CategoriesGrid from '../../components/ui/layout/CategoriesGrid';

const Home = () => {
    return (
        <div>
            <Hero2 />
            <ProductCarousel />
            <CategoriesGrid />
        </div>
    );
}

export default Home; 