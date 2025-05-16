import { useEffect, useState } from 'react';
import CategoryCard from '../../categories/CategoryCard';
import { productService } from '../../../services/productService';

const CategoriesGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productService
      .getCategories()
      .then(setCategories)
      .catch(() => setError('Error al cargar las categorías'))
      .finally(() => setLoading(false));
  }, []);

  const isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  };

  const getGridConfig = (count) => {
    if (count === 1) return { columns: ['col-12 px-2'] };
    
    if (isPrime(count)) {
      // Para números primos, la primera columna es completa y el resto en dos columnas
      const columns = ['col-12 px-2'];
      for (let i = 1; i < count; i++) {
        columns.push('col-6 px-2');
      }
      return { columns };
    }
    
    // Para números pares, todo en dos columnas
    return {
      columns: Array(count).fill('col-6 px-2')
    };
  };

  if (loading) return <div className="text-center p-4">Cargando categorías...</div>;
  if (error) return <div className="text-center text-danger p-4">{error}</div>;

  const { columns } = getGridConfig(categories.length);

  return (
    <div className="container mt-5">
      <div className="row">
        {categories.map((cat, idx) => (
          <div key={cat.id} className={columns[idx]}>
            <CategoryCard category={cat} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
