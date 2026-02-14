import React, { useState, useEffect } from 'react';
import CharacterCreationModal from './CharacterCreationModal';
import GameInterface from './GameInterface';

const App: React.FC = () => {
  const [characterCreated, setCharacterCreated] = useState(false);
  const [characterName, setCharacterName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('characterName');
    if (savedName) {
      setCharacterName(savedName);
      setCharacterCreated(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {!characterCreated ? (
        <CharacterCreationModal
          onCreate={(name: string) => {
            setCharacterName(name);
            setCharacterCreated(true);
            localStorage.setItem('characterName', name);
          }}
        />
      ) : (
        <GameInterface characterName={characterName} />
      )}
    </div>
  );
};

export default App;
