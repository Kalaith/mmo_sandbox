import React, { useState, useEffect } from "react";

interface CharacterCreationModalProps {
  onCreate: (name: string) => void;
}

const CharacterCreationModal: React.FC<CharacterCreationModalProps> = ({
  onCreate,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("characterName");
    if (savedName) setName(savedName);
  }, []);

  const handleCreate = () => {
    if (name) {
      onCreate(name);
      localStorage.setItem("characterName", name);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Your Character</h2>
        <div className="mb-4">
          <label
            htmlFor="character-name"
            className="block text-sm font-medium mb-1"
          >
            Character Name
          </label>
          <input
            id="character-name"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your character name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-600 border border-blue-800 text-white font-bold tracking-wider uppercase py-2 rounded hover:bg-blue-700 transition"
          onClick={handleCreate}
          disabled={!name.trim()}
        >
          Enter the World
        </button>
      </div>
    </div>
  );
};

export default CharacterCreationModal;
