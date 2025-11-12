'use client';

import React from 'react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-white' 
            : 'bg-gray-800'
        }`}>
          {isUser ? (
            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
          )}
        </div>
        
        {/* Message Content */}
        <div className={`rounded-lg px-3 py-2 ${
          isUser 
            ? 'bg-white text-black' 
            : 'bg-gray-800 text-white'
        }`}>
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.content}
          </div>
          <div className={`text-xs mt-1 opacity-60 ${
            isUser ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
