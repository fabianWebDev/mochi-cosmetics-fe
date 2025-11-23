import React from 'react';
import Error from './Error';

const ErrorExample = () => {
    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Ejemplos de uso del componente Error</h3>
            <div>
                <h4>Variantes:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Error message="Error por defecto" variant="default" />
                    <Error message="Advertencia importante" variant="warning" />
                    <Error message="Error crítico" variant="danger" />
                    <Error message="Operación exitosa" variant="success" />
                </div>
            </div>
            <div>
                <h4>Tamaños:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Error message="Error pequeño" variant="danger" size="small" />
                    <Error message="Error mediano" variant="warning" size="medium" />
                    <Error message="Error grande" variant="danger" size="large" />
                </div>
            </div>

            <div>
                <h4>Sin icono:</h4>
                <Error message="Mensaje sin icono" showIcon={false} />
            </div>

            <div>
                <h4>En contexto de formulario:</h4>
                <div style={{ maxWidth: '300px' }}>
                    <label>Email:</label>
                    <input type="email" style={{ width: '100%', padding: '0.5rem', margin: '0.25rem 0' }} />
                    <Error message="El email es requerido" variant="danger" size="small" />
                </div>
            </div>

            <div>
                <h4>Mensaje largo:</h4>
                <Error 
                    message="Este es un mensaje de error muy largo que debería envolverse correctamente en múltiples líneas sin romper el diseño del componente" 
                    variant="warning" 
                />
            </div>
        </div>
    );
};

export default ErrorExample;
