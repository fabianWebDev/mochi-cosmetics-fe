import { Link } from 'react-router-dom';

function Home() {
    return (
        <>
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-white font-bold text-xl">
                        Mi Tienda
                    </Link>
                    <div className="flex space-x-4">
                        <Link to="/" className="text-white hover:text-gray-300">
                            Inicio
                        </Link>
                        <Link to="/productos" className="text-white hover:text-gray-300">
                            Productos
                        </Link>
                        <Link to="/carrito" className="text-white hover:text-gray-300">
                            Carrito
                        </Link>
                        <Link to="/contacto" className="text-white hover:text-gray-300">
                            Contacto
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto mt-8">
                <h1 className="text-3xl font-bold">Bienvenido a Mi Tienda</h1>
            </div>
        </>
    );
}

export default Home; 