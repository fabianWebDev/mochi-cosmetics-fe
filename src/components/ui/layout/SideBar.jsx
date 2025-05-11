import ProductFilter from '../../product/ProductFilter';

const Sidebar = ({ onSortChange, onStockFilterChange, showInStockOnly }) => {
    return (
        <div>
            <ProductFilter
                onSortChange={onSortChange}
                onStockFilterChange={onStockFilterChange}
                showInStockOnly={showInStockOnly}
            />
        </div>
    )
}

export default Sidebar;