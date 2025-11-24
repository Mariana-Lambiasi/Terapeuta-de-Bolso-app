
import React from 'react';
import { Message as MessageType, Sender } from '../types';

interface MessageProps {
  message: MessageType;
}

const BotIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        TP
    </div>
);

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

const Message: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.sender === Sender.BOT;

  return (
    <div className={`flex items-end gap-3 ${!isBot ? 'justify-end' : 'justify-start'}`}>
      {isBot && <BotIcon />}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md ${
          isBot
            ? 'bg-teal-100 text-gray-800 rounded-bl-none'
            : 'bg-teal-600 text-white rounded-br-none'
        }`}
      >
        {message.isLoading ? <TypingIndicator /> : <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
      </div>
    </div>
  );
};

export default Message;
