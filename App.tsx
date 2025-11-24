
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { Message, Sender } from './types';
import { createChat } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import LoginPage from './components/LoginPage';
import HistoryPage from './components/HistoryPage';
import ExercisesPage from './components/ExercisesPage';

const initialMessage: Message = {
  id: 'initial-message',
  sender: Sender.BOT,
  text: "Olá! Eu sou o Terapeuta de Bolso. Estou aqui para oferecer um espaço seguro para você respirar e encontrar calma. Como você está se sentindo agora?",
  isLoading: false,
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatInstanceRef = useRef<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [view, setView] = useState<'chat' | 'history' | 'exercises'>('chat');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('pocketTherapistUser');
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
    
    try {
      chatInstanceRef.current = createChat();
      if (!chatInstanceRef.current) {
        setError("Não foi possível iniciar o assistente. Verifique a chave da API.");
      }
    } catch (e) {
      console.error(e);
      setError("Ocorreu um erro ao inicializar o assistente.");
    }
  }, []);
  
  const handleLogin = (email: string) => {
    localStorage.setItem('pocketTherapistUser', email);
    setCurrentUser(email);
    setMessages([initialMessage]); // Reset chat on login
    setView('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('pocketTherapistUser');
    setCurrentUser(null);
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading || !text.trim() || !chatInstanceRef.current) {
      if (!chatInstanceRef.current && !error) {
         setError("O assistente de chat não está disponível.");
      }
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.USER,
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = `bot-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, sender: Sender.BOT, text: '', isLoading: true },
    ]);
    
    try {
      setError(null);
      const stream = await chatInstanceRef.current.sendMessageStream({ message: text });

      let fullResponse = '';
      for await (const chunk of stream) {

        if (chunk.functionCalls) {
          for (const fc of chunk.functionCalls) {
            if (fc.name === 'CALL_EMERGENCY') {
              const systemMessage: Message = {
                id: `system-${Date.now()}`,
                sender: Sender.BOT,
                text: "Situação de emergência detectada. Iniciando chamada para 190. Se estiver em um local seguro, aguarde o atendimento. Se não for uma emergência, cancele a ligação.",
                isLoading: false,
              };
              
              setMessages((prev) => {
                const withoutLoading = prev.filter(msg => msg.id !== botMessageId);
                return [...withoutLoading, systemMessage];
              });

              window.location.href = 'tel:190';
              setIsLoading(false);
              return; 
            }
          }
        }
        
        if (chunk.text) {
            fullResponse += chunk.text;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
              )
            );
        }
      }
      
      setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullResponse, isLoading: false } : msg
          )
        );

    } catch (e) {
      console.error("Error sending message:", e);
      const errorMessage = "Desculpe, não consegui processar sua mensagem. Tente novamente.";
      setError(errorMessage);
       setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: errorMessage, isLoading: false } : msg
          )
        );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const renderView = () => {
    switch(view) {
      case 'chat':
        return (
          <>
            <ChatWindow messages={messages} />
            <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
          </>
        );
      case 'history':
        return <HistoryPage currentUser={currentUser} />;
      case 'exercises':
        return <ExercisesPage />;
      default:
        return null;
    }
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl h-[90vh] flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-200/50">
        <header className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-700">Terapeuta de Bolso 🌱</h1>
          <nav className="flex items-center space-x-1 sm:space-x-2">
             <button
              onClick={() => setView('chat')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${view === 'chat' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-teal-100'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${view === 'history' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-teal-100'}`}
            >
              Diário
            </button>
            <button
              onClick={() => setView('exercises')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${view === 'exercises' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-teal-100'}`}
            >
              Exercícios
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
              aria-label="Sair"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          </nav>
        </header>
        {error && <div className="p-2 text-center bg-red-100 text-red-700 flex-shrink-0">{error}</div>}
        
        {renderView()}
        
        <footer className="text-center text-xs text-gray-400 p-2 border-t border-gray-200 flex-shrink-0">
          Este é um assistente de IA e não substitui a ajuda profissional.
        </footer>
      </div>
    </div>
  );
};

export default App;
