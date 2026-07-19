import { useState, useCallback, useRef } from 'react';
import { api } from './api';
import { ChatMessage } from '../types';
import { demoCopilotResponses, demoCopilotFallback } from './demoData';

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

  const getDemoResponse = (text: string): string => {
    const lower = (text ?? '').toLowerCase().trim();
    for (const [key, value] of Object.entries(demoCopilotResponses)) {
      if (lower.includes(key)) return value;
    }
    return demoCopilotFallback;
  };

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    try {
      setState(prev => ({ ...prev, messages: [...prev.messages, userMsg], isLoading: true, error: null }));
      const response = await api.copilot.chat(text, state.conversationId);
      setState(prev => ({ ...prev, messages: [...prev.messages, response], isLoading: false }));
    } catch {
      const demoResponse: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: getDemoResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setState(prev => ({ ...prev, messages: [...prev.messages, demoResponse], isLoading: false }));
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
      setState(prev => ({ ...prev, messages: [...prev.messages, userMsg], isLoading: true, error: null }));
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
        const demoResponse: ChatMessage = {
          id: Math.random().toString(),
          sender: 'ai',
          text: getDemoResponse(text),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setState(prev => ({ ...prev, messages: [...prev.messages, demoResponse], isLoading: false }));
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