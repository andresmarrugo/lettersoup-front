import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-3xl mb-4">Bienvenido a la Sopa de Letras</h1>
      <div className="flex flex-col gap-4">
        <Link
          to="/game"
          className="p-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        >
          Iniciar Juego
        </Link>
        <Link
          to="/instructions"
          className="p-3 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600"
        >
          Instrucciones
        </Link>
        {/* Agregar más enlaces para otras funcionalidades */}
      </div>
    </div>
  );
};

export default Menu;
