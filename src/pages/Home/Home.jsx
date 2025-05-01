import { Layout } from '../../components';
const { Hero } = Layout;
import ProductCarousel from '../../components/ui/carousel/ProductCarousel';

const Home = () => {
    return (
        <div>
            <Hero />
            <ProductCarousel />
        </div>
    );
}

export default Home; 