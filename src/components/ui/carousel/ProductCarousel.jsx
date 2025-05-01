import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { productService } from '../../../services/productService';
import Card  from '../product/ProductCard';
import { MEDIA_BASE_URL } from '../../../constants';

const ProductCarousel = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const data = await productService.getLatestProducts(3);
                console.log(data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching latest products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Latest Products</h2>
            <Slider {...settings}>
                {products.map((product) => (
                    console.log(product),
                    <div key={product.id} className="px-2">
                        <Card name={product.name}
                            description={product.description}
                            image={product.image ? `${MEDIA_BASE_URL}${product.image}` : ''}
                            price={product.price}
                            stock={product.stock}
                            onClick={() => handleViewDetails(product.id)}
                            onAddToCart={() => handleAddToCart(product)} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductCarousel; 