import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white font-bold text-xl">
                    Mi Tienda
                </Link>
                <div className="flex space-x-4">
                    <Link to="/" className="text-white hover:text-gray-300">
                        Inicio
                    </Link>
                    <Link to="/products" className="text-white hover:text-gray-300">
                        Productos
                    </Link>
                    <Link to="/login" className="text-white hover:text-gray-300">
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="text-white hover:text-gray-300">
                        Registrarse
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
