import { useEffect, useState } from 'react';
import { productService } from '../../../services/productService';

const CategoriesGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.getCategories();
                setCategories(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las categorías');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const cardStyle = {
        backgroundImage: 'url("https://wallpapercave.com/wp/wp2106516.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '200px',
        color: 'white'
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '1.5rem'
    };

    const renderCategories = () => {
        const count = categories.length;
        
        if (count === 1) {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm mb-4" style={cardStyle}>
                            <div style={overlayStyle}>
                                <h2 className="card-title h3 mb-3">{categories[0].name}</h2>
                                {categories[0].description && (
                                    <p className="card-text">{categories[0].description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (count === 2) {
            return (
                <div className="row">
                    {categories.map((category) => (
                        <div key={category.id} className="col-6">
                            <div className="card shadow-sm mb-4" style={cardStyle}>
                                <div style={overlayStyle}>
                                    <h2 className="card-title h4 mb-3">{category.name}</h2>
                                    {category.description && (
                                        <p className="card-text">{category.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (count === 3) {
            return (
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm mb-4" style={cardStyle}>
                            <div style={overlayStyle}>
                                <h2 className="card-title h3 mb-3">{categories[0].name}</h2>
                                {categories[0].description && (
                                    <p className="card-text">{categories[0].description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {categories.slice(1).map((category) => (
                        <div key={category.id} className="col-6">
                            <div className="card shadow-sm mb-4" style={cardStyle}>
                                <div style={overlayStyle}>
                                    <h2 className="card-title h4 mb-3">{category.name}</h2>
                                    {category.description && (
                                        <p className="card-text">{category.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (count === 4) {
            return (
                <div className="row">
                    {categories.map((category) => (
                        <div key={category.id} className="col-6">
                            <div className="card shadow-sm mb-4" style={cardStyle}>
                                <div style={overlayStyle}>
                                    <h2 className="card-title h4 mb-3">{category.name}</h2>
                                    {category.description && (
                                        <p className="card-text">{category.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="row">
                {categories.map((category) => (
                    <div key={category.id} className="col-6 col-md-4 col-lg-3">
                        <div className="card shadow-sm mb-4" style={cardStyle}>
                            <div style={overlayStyle}>
                                <h2 className="card-title h5 mb-3">{category.name}</h2>
                                {category.description && (
                                    <p className="card-text">{category.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return <div className="text-center p-4">Cargando categorías...</div>;
    if (error) return <div className="text-center text-danger p-4">{error}</div>;

    return (
        <div className="container py-4">
            <h1 className="h2 mb-4">Categorías</h1>
            {renderCategories()}
        </div>
    );
};

export default CategoriesGrid;