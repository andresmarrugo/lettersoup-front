import React from 'react';

interface CellProps {
  letter: string;
  isSelected: boolean;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ letter, isSelected, onClick }) => {
  return (
    <div
      className={`w-8 h-8 flex justify-center items-center border font-bold border-black text-xl cursor-pointer ${isSelected ? 'bg-yellow-300' : ''}`}
      onClick={onClick}
    >
      {letter}
    </div>
  );
};

export default Cell;
