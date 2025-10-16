"use client";

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  sources?: Array<{
    chunkId: string;
    materialTitle: string;
    content: string;
    similarity: number;
  }>;
  metadata?: any;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title?: string;
  courseId?: string;
  course?: {
    code: string;
    title: string;
  };
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  message: string;
  courseId?: string;
  materialId?: string;
  sessionId?: string;
  userId: string;
}

export interface SendMessageResponse {
  success: boolean;
  sessionId: string;
  response: string;
  sources: Array<{
    chunkId: string;
    materialTitle: string;
    content: string;
    similarity: number;
  }>;
  confidence: number;
  isOutOfScope: boolean;
  followUpSuggestions?: string[];
}

/**
 * Hook for sending chat messages to AI assistant
 */
export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: SendMessageData): Promise<SendMessageResponse> => {
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      return response.json();
    },
  });
}

/**
 * Hook for getting chat session history
 */
export function useChatSession(sessionId?: string) {
  return useQuery({
    queryKey: ['chatSession', sessionId],
    queryFn: async (): Promise<ChatSession> => {
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const response = await fetch(`/api/v1/ai/chat?sessionId=${sessionId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get chat session');
      }

      const data = await response.json();
      return data.session;
    },
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting user's chat sessions
 */
export function useChatSessions(userId?: string) {
  return useQuery({
    queryKey: ['chatSessions', userId],
    queryFn: async (): Promise<ChatSession[]> => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await fetch(`/api/v1/ai/chat?userId=${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get chat sessions');
      }

      const data = await response.json();
      return data.sessions;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for managing chat state
 */
export function useChat(userId?: string, courseId?: string, materialId?: string) {
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessageMutation = useSendMessage();
  const { data: currentSession, refetch: refetchSession } = useChatSession(currentSessionId);
  const { data: sessions, refetch: refetchSessions } = useChatSessions(userId);

  const sendMessage = async (message: string) => {
    if (!userId || !message.trim()) return;

    setIsTyping(true);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: message,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await sendMessageMutation.mutateAsync({
        message,
        courseId,
        materialId,
        sessionId: currentSessionId,
        userId,
      });

      // Update session ID if it's a new session
      if (!currentSessionId) {
        setCurrentSessionId(result.sessionId);
      }

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: result.response,
        role: 'assistant',
        sources: result.sources,
        metadata: {
          confidence: result.confidence,
          isOutOfScope: result.isOutOfScope,
          followUpSuggestions: result.followUpSuggestions,
        },
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => {
        // Remove the temporary user message and add both final messages
        const withoutTemp = prev.filter(m => m.id !== userMessage.id);
        return [
          ...withoutTemp,
          { ...userMessage, id: `user-${Date.now()}` },
          aiMessage,
        ];
      });

      // Refetch sessions to update the list
      refetchSessions();
    } catch (error) {
      console.error('Failed to send message:', error);

      // Remove the temporary message and show error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I couldn't process your message. Please try again.",
        role: 'assistant',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewSession = () => {
    setCurrentSessionId(undefined);
    setMessages([]);
  };

  const loadSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    // Messages will be loaded automatically by the query
  };

  // Update messages when session data changes
  React.useEffect(() => {
    if (currentSession?.messages) {
      setMessages(currentSession.messages);
    }
  }, [currentSession]);

  return {
    messages,
    sessions: sessions || [],
    currentSessionId,
    isTyping,
    isLoading: sendMessageMutation.isPending,
    sendMessage,
    startNewSession,
    loadSession,
    refetchSessions,
  };
}
