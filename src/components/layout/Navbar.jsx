import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            navigate('/');
        }
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="font-bold text-xl">
                    Mi Tienda
                </Link>
                <div className="flex space-x-4 items-center">
                    <Link to="/" className="hover:text-gray-300">
                        Inicio
                    </Link>
                    <Link to="/products" className="hover:text-gray-300">
                        Productos
                    </Link>

                    <Link to="/contact" className="hover:text-gray-300">
                        Contacto
                    </Link>
                    <Link to="/cart" className="hover:text-gray-300 flex items-center">
                        <i className="bi bi-cart me-1"></i>
                        Carrito
                    </Link>
                    {!user ? (
                        <>
                            <Link to="/login" className="hover:text-gray-300">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="hover:text-gray-300">
                                Registrarse
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/orders" className="hover:text-gray-300">
                                Mis Órdenes
                            </Link>
                            <span className=" ">
                                {user.first_name || user.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="hover:text-gray-300 cursor-pointer"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
