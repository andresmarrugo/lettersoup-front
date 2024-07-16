import React from 'react';

interface BoardProps {
  board: string[][];
  selectedCells: [number, number][];
  cellColors: Record<string, string>;
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseOver: (row: number, col: number) => void;
  onCellMouseUp: () => void;
  onCellTouchStart: (e: React.TouchEvent) => void;
  onCellTouchMove: (e: React.TouchEvent) => void;
  onCellTouchEnd: (e: React.TouchEvent) => void;
}

const Board: React.FC<BoardProps> = ({ 
  board, 
  selectedCells, 
  cellColors,
  onCellMouseDown, 
  onCellMouseOver, 
  onCellMouseUp,
  onCellTouchStart,
  onCellTouchMove,
  onCellTouchEnd
}) => {
  return (
    <div
      className="grid grid-cols-10 gap-1 border border-gray-500 p-2 bg-gray-50 mt-3 select-none"
      onMouseUp={onCellMouseUp}
      onTouchEnd={onCellTouchEnd}
      onTouchStart={onCellTouchStart}
      onTouchMove={onCellTouchMove}
    >
      {board.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
          const cellColor = cellColors[`${rowIndex},${colIndex}`];
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-8 h-8 flex items-center justify-center border 
                ${isSelected ? 'bg-blue-200' : 'bg-white'}`}
              style={cellColor ? { backgroundColor: cellColor } : {}}
              onMouseDown={() => onCellMouseDown(rowIndex, colIndex)}
              onMouseOver={() => onCellMouseOver(rowIndex, colIndex)}
            >
              {cell}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Board;