import React, { useState, useEffect, useMemo } from 'react';
import { MoodEntry } from '../types';
import { loadMoods, saveMood } from '../services/moodService';

interface HistoryPageProps {
  currentUser: string;
}

const moodOptions: { [key: number]: { emoji: string; label: string; color: string } } = {
  1: { emoji: '😟', label: 'Muito Ansioso', color: 'bg-red-200' },
  2: { emoji: '🙁', label: 'Ansioso', color: 'bg-orange-200' },
  3: { emoji: '😐', label: 'Neutro', color: 'bg-yellow-200' },
  4: { emoji: '🙂', label: 'Calmo', color: 'bg-green-200' },
  5: { emoji: '😊', label: 'Muito Calmo', color: 'bg-teal-200' },
};

const HistoryPage: React.FC<HistoryPageProps> = ({ currentUser }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const userMoods = loadMoods(currentUser);
    setMoodEntries(userMoods);
  }, [currentUser]);

  const handleLogMood = (level: 1 | 2 | 3 | 4 | 5) => {
    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      level,
      timestamp: Date.now(),
    };

    const updatedMoods = saveMood(currentUser, newEntry);
    setMoodEntries(updatedMoods);
    
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000); // Hide after 2 seconds
  };
  
  const sortedEntries = useMemo(() => {
    return [...moodEntries].sort((a, b) => b.timestamp - a.timestamp);
  }, [moodEntries]);

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-y-auto">
      <div className={`
        mb-6 p-4 rounded-lg transition-all duration-500 ease-in-out transform 
        ${showConfirmation ? 'bg-teal-100 shadow-lg scale-[1.02]' : 'bg-white/50 shadow-md scale-100'}
      `}>
        <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">Como você está se sentindo agora?</h2>
        <div className="flex justify-around items-center">
          {Object.entries(moodOptions).map(([level, { emoji, label }]) => (
            <button
              key={level}
              onClick={() => handleLogMood(Number(level) as 1 | 2 | 3 | 4 | 5)}
              className="flex flex-col items-center space-y-1 text-gray-600 hover:text-teal-600 transition-transform transform hover:scale-110"
              title={label}
            >
              <span className="text-3xl sm:text-4xl">{emoji}</span>
            </button>
          ))}
        </div>
         {showConfirmation && (
            <p className="text-center text-sm font-medium text-teal-700 mt-3">Seu estado foi registrado. ✨</p>
         )}
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 px-2">Seu Histórico</h2>
        {sortedEntries.length > 0 ? (
          <ul className="space-y-3">
            {sortedEntries.map((entry) => (
              <li key={entry.id} className={`p-3 rounded-lg flex items-center space-x-4 shadow-sm ${moodOptions[entry.level].color}`}>
                <span className="text-2xl">{moodOptions[entry.level].emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{moodOptions[entry.level].label}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(entry.timestamp).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     {' às '} 
                    {new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 px-4">
            <p className="text-gray-500">Você ainda não tem registros.</p>
            <p className="text-sm text-gray-400 mt-1">Use os emojis acima para começar seu diário.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;