
import React, { useState } from 'react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);


const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white/60 rounded-b-2xl">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          className="flex-1 w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[#6FA8DC] disabled:opacity-50 transition-shadow"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-2 rounded-full bg-[#6FA8DC] text-white hover:bg-[#5a96c9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6FA8DC] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-110 active:scale-100"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default InputBar;
