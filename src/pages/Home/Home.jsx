import { Layout } from '../../components';
const { Hero } = Layout;
import ProductCarousel from '../../components/ui/carousel/ProductCarousel';
import CategoriesGrid from '../../components/ui/layout/CategoriesGrid';

const Home = () => {
    return (
        <div>
            <Hero />
            <ProductCarousel />
            <CategoriesGrid />
        </div>
    );
}

export default Home; 