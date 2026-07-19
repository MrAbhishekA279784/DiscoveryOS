import { useState, useCallback, useRef, useEffect } from 'react';
import { api, APIException } from './api';
import { ChatMessage } from '../types';

export interface CopilotState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  conversationId: string;
}

export function useCopilot(): CopilotState & { 
  sendMessage: (text: string) => Promise<void>;
  streamMessage: (text: string, onChunk: (chunk: string) => void) => Promise<void>;
  clearHistory: () => void;
} {
  const [state, setState] = useState<CopilotState>({
    messages: [],
    isLoading: false,
    error: null,
    conversationId: `conv-${Date.now()}`
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    try {
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, userMsg], 
        isLoading: true, 
        error: null 
      }));
      const response = await api.copilot.chat(text, state.conversationId);
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, response],
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof APIException 
        ? `Chat failed (${error.status})`
        : error instanceof Error 
        ? error.message
        : 'Chat failed';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [state.conversationId]);

  const streamMessage = useCallback(async (text: string, onChunk: (chunk: string) => void) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    try {
      setState(prev => ({ 
        ...prev, 
        messages: [...prev.messages, userMsg], 
        isLoading: true, 
        error: null 
      }));
      abortControllerRef.current = new AbortController();

      const response = await api.copilot.stream(text, state.conversationId);
      
      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        accumulated += chunk;
        onChunk(chunk);
      }

      const newAiMessage: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: accumulated,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newAiMessage],
        isLoading: false
      }));
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        const errorMessage = error instanceof APIException 
          ? `Stream failed (${error.status})`
          : error.message;
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
      }
    }
  }, [state.conversationId]);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      conversationId: `conv-${Date.now()}`
    }));
  }, []);

  return { ...state, sendMessage, streamMessage, clearHistory };
}
