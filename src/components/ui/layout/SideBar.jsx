import ProductFilter from '../../product/ProductFilter';

const SideBar = ({ onSortChange, onStockFilterChange, showInStockOnly }) => {
    return (
        <ProductFilter
            onSortChange={onSortChange}
            onStockFilterChange={onStockFilterChange}
            showInStockOnly={showInStockOnly}
        />
    )
}

export default SideBar;