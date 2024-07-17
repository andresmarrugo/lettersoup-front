import React, { useState, useEffect, useRef } from 'react';
import Board from './Board';
import WordList from './WordList';
import Modal from './Modal';

const Game: React.FC = () => {
  const [board, setBoard] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>(['REACT', 'JAVASCRIPT', 'HOOK', 'COMPONENT', 'FRONTEND', 'INTERFACE', 'DISEÑO']);
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setFoundWordsWithCells] = useState<{word: string, cells: [number, number][]}[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setFoundWordsColors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [cellColors, setCellColors] = useState<Record<string, string>>({});

  const fetchData = async () =>{
    try {
      setLoading(true)
      const response  = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/random-words?minLength=4&maxLength=9&count=10`)
      if(!response.ok){
        throw new Error("Network response was wrong")
      }
      const data: Array<string> = await response.json()
      const upperWords = data.map(word=> word.toUpperCase())
      setWords(upperWords)
      setLoading(false)
      return data
    } catch (error) {
      setError(error)
    }
  }

  useEffect(()=>{
      fetchData()
  },[])

  useEffect(() => {
    const newBoard = generateBoard(words, 10, 10); // Tamaño del tablero 10x10
    setBoard(newBoard);
    startTimer();
    return () => stopTimer();
  }, [words]);

  useEffect(() => {
    if (foundWords.length === words.length) {
      stopTimer();
      setIsModalOpen(true);
    }
  }, [foundWords]);

  const startTimer = () => {
    stopTimer(); // Asegurarse de que no haya temporizadores anteriores corriendo
    setTime(0);
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const generateBoard = (words: string[], rows: number, cols: number): string[][] => {
    const board = Array.from({ length: rows }, () => Array(cols).fill(''));
    const directions: [number, number][] = [
      [0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]
    ];
  
    // Shuffle words randomly
    words.sort(() => Math.random() - 0.5);
  
    const remainingWords = [...words];
  
    while (remainingWords.length > 0) {
      let wordIndex = 0;
  
      while (wordIndex < remainingWords.length) {
        const word = remainingWords[wordIndex];
        let placed = false;
        let attempts = 0;
  
        while (!placed && attempts < 500) {
          attempts++;
          const direction = directions[Math.floor(Math.random() * directions.length)];
          const row = Math.floor(Math.random() * rows);
          const col = Math.floor(Math.random() * cols);
  
          if (canPlaceWord(board, word, row, col, direction)) {
            placeWord(board, word, row, col, direction);
            placed = true;
            remainingWords.splice(wordIndex, 1); // Remove placed word from remaining list
          }
        }
  
        if (!placed) {
          console.warn(`No se pudo colocar la palabra: ${word}`);
          wordIndex++; // Try next word in next iteration
        }
      }
    }
  
    // Fill empty spaces strategically (modified)
    fillEmptySpaces(board, rows, cols);
  
    return board;
  };
  
  const canPlaceWord = (board: string[][], word: string, row: number, col: number, direction: [number, number]): boolean => {
    const [dx, dy] = direction;
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;
      if (
        newRow < 0 ||
        newRow >= board.length ||
        newCol < 0 ||
        newCol >= board[0].length
      ) {
        return false;
      }
  
      // Allow overlap if the existing letter matches the current word letter
      if (board[newRow][newCol] !== '' && board[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    return true;
  };
  
  const placeWord = (board: string[][], word: string, row: number, col: number, direction: [number, number]): void => {
    const [dx, dy] = direction;
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dx;
      const newCol = col + i * dy;
      board[newRow][newCol] = word[i];
    }
  };
  
  const fillEmptySpaces = (board: string[][], rows: number, cols: number): void => {
    // Prioritize filling spaces that can create overlaps (modified)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === '') {
          const neighbors = getNeighbors(board, r, c);
          const possibleWords = [];
  
          // Check neighboring letters for overlap opportunities
          for (const neighbor of neighbors) {
            if (neighbor !== '') {
              possibleWords.push(...words.filter(w => w.includes(neighbor)));
            }
          }
  
          // If there are possible overlapping words, choose a random one to fill the space
          if (possibleWords.length > 0) {
            const randomWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
            const randomLetterIndex = randomWord.indexOf(board[r][c]); // Use existing letter if possible
            board[r][c] = randomLetterIndex !== -1 ? randomWord[randomLetterIndex] : String.fromCharCode(65 + Math.floor(Math.random() * 26));
          } else {
            // If no overlap opportunities, fill randomly
            board[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          }
        }
      }
    }
  };
  
  const getNeighbors = (board: string[][], row: number, col: number): string[] => {
    const neighbors = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];
  
    for (const direction of directions) {
      const newRow = row + direction[0];
      const newCol = col + direction[1];
  
      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length
      ) {
        neighbors.push(board[newRow][newCol]);
      }
    }
  
    return neighbors;
  };
  
  

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setSelectedCells([[row, col]]);
    setStartCell([row, col]);
  };

  const handleMouseOver = (row: number, col: number) => {
    if (isDragging && startCell) {
      const [startRow, startCol] = startCell;
      const dx = row - startRow;
      const dy = col - startCol;

      if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
        const newSelectedCells: [number, number][] = [];
        const stepX = dx !== 0 ? dx / Math.abs(dx) : 0;
        const stepY = dy !== 0 ? dy / Math.abs(dy) : 0;
        let currentRow = startRow;
        let currentCol = startCol;

        while (currentRow !== row + stepX || currentCol !== col + stepY) {
          newSelectedCells.push([currentRow, currentCol]);
          currentRow += stepX;
          currentCol += stepY;
        }

        setSelectedCells(newSelectedCells);
      }
    }
  };

  const generatePastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  const blendColors = (color1: string, color2: string): string => {
    const [h1, s1, l1] = color1.match(/\d+/g)!.map(Number);
    const [h2, s2, l2] = color2.match(/\d+/g)!.map(Number);
    const h = Math.round((h1 + h2) / 2);
    const s = Math.round((s1 + s2) / 2);
    const l = Math.round((l1 + l2) / 2);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const maxLength = Math.max(...words.map(word => word.length));
    if (selectedCells.length > 1) {
      const word = selectedCells.map(([r, c]) => board[r][c]).join('');
      if (words.includes(word) && !foundWords.includes(word)) {
        const newColor = generatePastelColor();
        setFoundWords(prev => [...prev, word]);
        setFoundWordsWithCells(prev => [...prev, {word, cells: selectedCells}]);
        setFoundWordsColors(prev => ({...prev, [word]: newColor}));
        
        // Actualizar cellColors
        const newCellColors = {...cellColors};
        selectedCells.forEach(([r, c]) => {
          const cellKey = `${r},${c}`;
          if (newCellColors[cellKey]) {
            newCellColors[cellKey] = blendColors(newCellColors[cellKey], newColor);
          } else {
            newCellColors[cellKey] = newColor;
          }
        });
        setCellColors(newCellColors);
        
        setPoints(prev => prev + 10);
        setSelectedCells([]);
      } else if (selectedCells.length >= maxLength) {
        setSelectedCells([]);
      }
    }
  };


  const getTouchPosition = (e: React.TouchEvent, boardElement: HTMLDivElement) => {
    const touch = e.touches[0];
    const rect = boardElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const cellWidth = rect.width / 10; // Assuming 10 columns
    const cellHeight = rect.height / 10; // Assuming 10 rows
    const row = Math.floor(y / cellHeight);
    const col = Math.floor(x / cellWidth);
    return [row, col];
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const boardElement = e.currentTarget as HTMLDivElement;
    const [row, col] = getTouchPosition(e, boardElement);
    handleMouseDown(row, col);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const boardElement = e.currentTarget as HTMLDivElement;
    const [row, col] = getTouchPosition(e, boardElement);
    handleMouseOver(row, col);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  };

  const handleRestart = async () => {
    setSelectedCells([]);
    setFoundWords([]);
    setFoundWordsWithCells([]);
    setFoundWordsColors({});
    setCellColors({});
    setPoints(0);
    const newWords= await fetchData() as Array<string>
    const newBoard = generateBoard(newWords, 10, 10);
    setBoard(newBoard);
    setIsModalOpen(false);
    startTimer();
  };

  if(loading){
    return <p>Loading</p>
  }

  if(error){
    return <p>Error getting words</p>
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <Board 
        board={board} 
        selectedCells={selectedCells} 
        cellColors={cellColors}
        onCellMouseDown={handleMouseDown}
        onCellMouseOver={handleMouseOver}
        onCellMouseUp={handleMouseUp}
        onCellTouchStart={handleTouchStart}
        onCellTouchMove={handleTouchMove}
        onCellTouchEnd={handleTouchEnd}
      />
      <WordList words={words} foundWords={foundWords} />
      <div className="mt-4">
        <div className="text-xl">Puntos: {points}</div>
        <div className="text-xl">Tiempo: {time} s</div>
      </div>
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={handleRestart}
      >
        Reiniciar Juego
      </button>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRestart={handleRestart} 
        points={points}
        time={time}
      />
    </div>
  );
};

export default Game;
