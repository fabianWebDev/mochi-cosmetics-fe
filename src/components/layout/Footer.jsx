const Footer = () => {
    return (
        <footer className="bg-gray-800 py-4">
            <div className="container mx-auto px-4">
                <p className="text-center">
                    &copy; {new Date().getFullYear()} Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
