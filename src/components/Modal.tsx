import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  points: number;
  time: number;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onRestart, points, time }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-2xl mb-4">¡Felicidades!</h2>
        <p className="mb-4">Has encontrado todas las palabras.</p>
        <p className="mb-4">Puntos: {points}</p>
        <p className="mb-4">Tiempo: {time} segundos</p>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={onRestart}
          >
            Nueva Partida
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
