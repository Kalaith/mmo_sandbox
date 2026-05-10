import React, { useState, useEffect } from 'react';
import CharacterCreationModal from './CharacterCreationModal';
import GameInterface from './GameInterface';
import { createCharacter, getProfile, type MmoProfile } from '../../api/handlers';

const App: React.FC = () => {
  const [profile, setProfile] = useState<MmoProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(error => setError(error instanceof Error ? error.message : 'Unable to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (name: string) => {
    setError(null);
    try {
      setProfile(await createCharacter(name));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to create character.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {loading ? (
        <div className="p-8">Loading...</div>
      ) : !profile?.character.created ? (
        <CharacterCreationModal onCreate={handleCreate} error={error} />
      ) : (
        <GameInterface profile={profile} />
      )}
    </div>
  );
};

export default App;
