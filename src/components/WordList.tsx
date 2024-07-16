import React from 'react';

interface WordListProps {
  words: string[];
  foundWords: string[];
}

const WordList: React.FC<WordListProps> = ({ words, foundWords }) => {
  return (
    <div className="mt-4 flex space-x-3 flex-wrap max-w-80 justify-center">
      {words.map((word, index) => (
        <div
          key={index}
          className={`text-lg my-1 ${foundWords.includes(word) ? 'line-through text-green-500' : ''}`}
        >
          {word}
        </div>
      ))}
    </div>
  );
};

export default WordList;
