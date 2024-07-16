import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isGamePage = location.pathname === '/game';

  return (
    <nav className="bg-gray-800 p-2 absolute top-0 w-full min-h-19">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-xl">
          <Link to="/" className="hover:text-gray-300">Inicio</Link>
        </div>
        {isGamePage ? (
          <div>
            <button className="mr-4 bg-blue-500 text-white px-4 py-2 rounded">
              Reiniciar
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Salir
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
