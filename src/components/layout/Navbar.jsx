import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="font-bold text-xl">
                    Mi Tienda
                </Link>
                <div className="flex space-x-4">
                    <Link to="/" className="hover:text-gray-300">
                        Inicio
                    </Link>
                    <Link to="/products" className="hover:text-gray-300">
                        Productos
                    </Link>
                    <Link to="/login" className="hover:text-gray-300">
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="hover:text-gray-300">
                        Registrarse
                    </Link>
                    <Link to="/contact" className="hover:text-gray-300">
                        Contacto
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
