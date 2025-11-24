
import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';

const exercises: Exercise[] = [
  {
    id: 'box-breathing',
    title: 'Respiração Quadrada',
    description: 'Uma técnica simples para acalmar o sistema nervoso e focar a mente.',
    emoji: '🌬️',
    type: 'breathing',
    duration: '2 Min',
    timings: { inhale: 4, hold: 4, exhale: 4, hold2: 4 },
  },
  {
    id: '4-7-8-breathing',
    title: 'Respiração 4-7-8',
    description: 'Conhecida como "respiração relaxante", ajuda a reduzir a ansiedade e a induzir o sono.',
    emoji: '🧘',
    type: 'breathing',
    duration: '2 Min',
    timings: { inhale: 4, hold: 7, exhale: 8 },
  },
  {
    id: 'deep-calm-breathing',
    title: 'Respiração Profunda Calmante',
    description: 'Uma técnica fundamental para reduzir o estresse rapidamente, focando em expirações longas.',
    emoji: '🌊',
    type: 'breathing',
    duration: '3 Min',
    timings: { inhale: 5, hold: 2, exhale: 7 },
  },
  {
    id: 'mindful-minute',
    title: 'Minuto de Atenção Plena',
    description: 'Um breve exercício para se conectar com o momento presente e observar seus pensamentos.',
    emoji: '✨',
    type: 'meditation',
    duration: '1 Min',
    steps: [
      "Sente-se confortavelmente e feche os olhos suavemente.",
      "Concentre-se no som e na sensação da sua respiração.",
      "Quando sua mente divagar, gentilmente traga o foco de volta para a respiração.",
      "Não há problema em ter pensamentos. Apenas observe-os sem julgamento.",
      "Continue por um minuto, simplesmente estando presente.",
    ],
  },
  {
    id: 'body-scan-meditation',
    title: 'Escaneamento Corporal',
    description: 'Relaxe o corpo e a mente, prestando atenção gentil a cada parte do seu corpo, da cabeça aos pés.',
    emoji: '👣',
    type: 'meditation',
    duration: '5 Min',
    steps: [
      "Deite-se ou sente-se confortavelmente. Feche os olhos.",
      "Leve sua atenção para os dedos dos pés. Sinta qualquer sensação sem julgamento.",
      "Lentamente, mova sua atenção para cima, através das solas dos pés, tornozelos, e pernas.",
      "Continue subindo pelo seu tronco, braços, até chegar ao topo da sua cabeça.",
      "Observe cada parte, liberando qualquer tensão que encontrar.",
      "Ao final, sinta seu corpo inteiro como um todo, relaxado e presente."
    ]
  },
  {
    id: 'energizing-breath',
    title: 'Respiração Energizante',
    description: 'Um exercício rápido para aumentar o foco e a energia quando se sentir sonolento ou desfocado.',
    emoji: '⚡️',
    type: 'breathing',
    duration: '1 Min',
    timings: { inhale: 3, hold: 1, exhale: 3 },
  },
];

const BreathingExerciseGuide: React.FC<{ exercise: Exercise; onBack: () => void }> = ({ exercise, onBack }) => {
  const [instruction, setInstruction] = useState('Prepare-se...');
  const [animationStyle, setAnimationStyle] = useState({
    transform: 'scale(0.8)',
    transitionDuration: '2s',
  });
  const { inhale, hold, exhale, hold2 } = exercise.timings!;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const runCycle = (step = -1) => { // Começa em -1 para fase de preparação
      switch (step) {
        case -1: // Preparar
          setInstruction('Prepare-se...');
          setAnimationStyle({ transform: 'scale(0.8)', transitionDuration: `2s` });
          timer = setTimeout(() => runCycle(0), 2000);
          break;
        case 0: // Inspirar
          setInstruction(`Inspire... (${inhale}s)`);
          setAnimationStyle({ transform: 'scale(1)', transitionDuration: `${inhale}s` });
          timer = setTimeout(() => runCycle(1), inhale * 1000);
          break;
        case 1: // Segurar
          setInstruction(`Segure... (${hold}s)`);
          // Nenhum estilo precisa mudar, mantém scale(1)
          timer = setTimeout(() => runCycle(2), hold * 1000);
          break;
        case 2: // Expirar
          setInstruction(`Expire... (${exhale}s)`);
          setAnimationStyle({ transform: 'scale(0.8)', transitionDuration: `${exhale}s` });
          timer = setTimeout(() => runCycle(hold2 ? 3 : 0), exhale * 1000);
          break;
        case 3: // Segurar 2 (se existir)
          if (hold2) {
            setInstruction(`Segure... (${hold2}s)`);
            // Nenhum estilo precisa mudar, mantém scale(0.8)
            timer = setTimeout(() => runCycle(0), hold2 * 1000);
          } else {
            runCycle(0);
          }
          break;
        default:
          runCycle(0);
          break;
      }
    };
    
    runCycle(); // Inicia o ciclo

    return () => {
      clearTimeout(timer);
    };
  }, [exercise, inhale, hold, exhale, hold2]);

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between items-center text-center">
        <div>
             <button onClick={onBack} className="flex items-center text-sm text-[#6FA8DC] hover:underline mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Voltar para a lista
            </button>
            <h2 className="text-2xl font-bold text-gray-700">{exercise.title}</h2>
            <p className="text-gray-500 mt-1">{exercise.description}</p>
        </div>
      
        <div className="relative w-48 h-48 flex items-center justify-center">
             <div className="absolute w-full h-full border-4 border-[#6FA8DC]/30 rounded-full opacity-50"></div>
            <div 
                className="absolute w-full h-full bg-[#6FA8DC] rounded-full transition-transform ease-in-out"
                style={animationStyle}
            ></div>
            <p className="z-10 text-xl font-semibold text-white">{instruction}</p>
        </div>

        <p className="text-xs text-gray-400">Continue respirando neste ritmo. Sinta a calma se espalhar pelo seu corpo.</p>
    </div>
  );
};


const MeditationExerciseGuide: React.FC<{ exercise: Exercise; onBack: () => void }> = ({ exercise, onBack }) => {
  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-y-auto">
        <div className="self-start">
            <button onClick={onBack} className="flex items-center text-sm text-[#6FA8DC] hover:underline mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Voltar para a lista
            </button>
        </div>
        <div className="flex flex-col text-center">
            <h2 className="text-2xl font-bold text-gray-700">{exercise.title}</h2>
            <p className="text-gray-500 mt-1 mb-6">{exercise.description}</p>
            <div className="text-left max-w-md mx-auto space-y-4">
                {exercise.steps?.map((step, index) => (
                    <div key={index} className="flex items-start">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#6FA8DC] text-white font-bold text-sm mr-3 flex-shrink-0">{index + 1}</span>
                        <p className="text-gray-600">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};


const ExercisesPage: React.FC = () => {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  if (activeExercise) {
     if(activeExercise.type === 'breathing') {
         return <BreathingExerciseGuide exercise={activeExercise} onBack={() => setActiveExercise(null)} />;
     }
     if(activeExercise.type === 'meditation') {
        return <MeditationExerciseGuide exercise={activeExercise} onBack={() => setActiveExercise(null)} />;
     }
     return null;
  }

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-700">Práticas de Relaxamento</h2>
        <p className="text-gray-500 mt-1">Escolha um exercício para encontrar um momento de calma.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => setActiveExercise(exercise)}
            className="p-6 bg-white/60 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-left flex items-start space-x-4"
          >
            <div className="text-4xl">{exercise.emoji}</div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-800">{exercise.title}</h3>
                <span className="text-xs font-medium text-[#3b6b99] bg-blue-100 px-2 py-0.5 rounded-full">{exercise.duration}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExercisesPage;
