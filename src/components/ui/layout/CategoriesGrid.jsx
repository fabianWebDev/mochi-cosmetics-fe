import { useEffect, useState } from 'react';
import CategoryCard from '../../categories/CategoryCard';
import { productService } from '../../../services/productService';
import Loading from '../common/Loading';
import classes from './CategoriesGrid.module.css';

const CategoriesGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        // Handle paginated response
        setCategories(response.results || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error al cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-danger p-4">{error}</div>;
  if (!Array.isArray(categories) || categories.length === 0) {
    return <div className="text-center p-4">No hay categorías disponibles</div>;
  }

  return (
    <div className={classes.categories_grid}>
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
};

export default CategoriesGrid;
