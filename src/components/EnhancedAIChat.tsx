import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { aiService, AIMessage, AIResponse, RoleContext } from '@/services/aiService';

interface EnhancedAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  userData?: any;
  recentActivity?: any[];
}

const EnhancedAIChat: React.FC<EnhancedAIChatProps> = ({ 
  isOpen, 
  onClose, 
  role, 
  userData, 
  recentActivity = [] 
}) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = {
    developer: [
      { id: 'code-review', label: 'Code Review', icon: 'ð', description: 'Get help reviewing your code' },
      { id: 'debug-help', label: 'Debug Help', icon: 'ð', description: 'Debug your code issues' },
      { id: 'learn-tech', label: 'Learn Tech', icon: 'ð', description: 'Learn new technologies' },
      { id: 'career-advice', label: 'Career Advice', icon: 'ð', description: 'Get career guidance' }
    ],
    freelancer: [
      { id: 'find-clients', label: 'Find Clients', icon: 'ð', description: 'Get help finding clients' },
      { id: 'pricing-help', label: 'Pricing Help', icon: 'ð', description: 'Set your rates correctly' },
      { id: 'portfolio-review', label: 'Portfolio Review', icon: 'ð', description: 'Review your portfolio' },
      { id: 'business-growth', label: 'Business Growth', icon: 'ð', description: 'Grow your business' }
    ],
    recruiter: [
      { id: 'job-description', label: 'Job Description', icon: 'ð', description: 'Write better job descriptions' },
      { id: 'interview-questions', label: 'Interview Questions', icon: 'ð', description: 'Get interview questions' },
      { id: 'sourcing-strategy', label: 'Sourcing Strategy', icon: 'ð', description: 'Find better candidates' },
      { id: 'diversity-hiring', label: 'Diversity Hiring', icon: 'ð', description: 'Improve diversity hiring' }
    ],
    manager: [
      { id: 'team-meeting', label: 'Team Meeting', icon: 'ð', description: 'Structure team meetings' },
      { id: 'performance-review', label: 'Performance Review', icon: 'ð', description: 'Handle performance reviews' },
      { id: 'conflict-resolution', label: 'Conflict Resolution', icon: 'ð', description: 'Resolve team conflicts' },
      { id: 'strategy-planning', label: 'Strategy Planning', icon: 'ð', description: 'Plan team strategy' }
    ]
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const createRoleContext = useCallback((): RoleContext => ({
    role: role as any,
    userData: userData || user,
    recentActivity
  }), [role, userData, user, recentActivity]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);
    setSuggestions([]);
    setFollowUpQuestions([]);

    try {
      const context = createRoleContext();
      const response: AIResponse = await aiService.sendMessage(messageText, messages, context);

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setSuggestions(response.suggestions || []);
      setFollowUpQuestions(response.followUpQuestions || []);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionId: string) => {
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const context = createRoleContext();
      const response = await aiService.generateQuickAction(actionId, context);

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error with quick action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleFollowUpClick = (question: string) => {
    handleSendMessage(question);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>')
      .replace(/\n/g, '<br />');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '400px',
      backgroundColor: 'white',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981'
          }} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
            AI Assistant
          </h3>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            backgroundColor: '#e5e7eb',
            color: '#6b7280'
          }}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </div>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#6b7280',
            padding: '0.5rem',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}
        >
          ×
        </Button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.length === 0 && showQuickActions && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem'
            }}>ð</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>Hello! I'm your AI assistant</h4>
            <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
              I can help you with {role}-specific tasks and questions
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem'
            }}>
              {quickActions[role as keyof typeof quickActions]?.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  disabled={isLoading}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    opacity: isLoading ? 0.5 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                  <span style={{ fontWeight: '500' }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              gap: '0.5rem'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: message.role === 'user' ? '#3b82f6' : '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600',
              flexShrink: 0
            }}>
              {message.role === 'user' ? 'U' : 'AI'}
            </div>
            <div style={{
              maxWidth: '85%',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              backgroundColor: message.role === 'user' ? '#3b82f6' : '#f9fafb',
              color: message.role === 'user' ? 'white' : '#1f2937'
            }}>
              <div 
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                style={{ fontSize: '0.875rem', lineHeight: '1.4' }}
              />
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              AI
            </div>
            <div style={{
              padding: '0.75rem',
              borderRadius: '0.75rem',
              backgroundColor: '#f9fafb',
              color: '#6b7280'
            }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out both'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.16s'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.32s'
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && !isLoading && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '0.5rem',
            border: '1px solid #bae6fd'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#0369a1' }}>
              Suggestions
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #bae6fd',
                    borderRadius: '0.25rem',
                    backgroundColor: 'white',
                    color: '#0369a1',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up Questions */}
        {followUpQuestions.length > 0 && !isLoading && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.5rem',
            border: '1px solid #bbf7d0'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#166534' }}>
              Follow-up Questions
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleFollowUpClick(question)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #bbf7d0',
                    borderRadius: '0.25rem',
                    backgroundColor: 'white',
                    color: '#166534',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(input);
              }
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              opacity: !input.trim() || isLoading ? 0.5 : 1,
              fontSize: '0.875rem'
            }}
          >
            {isLoading ? '...' : 'Send'}
          </Button>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedAIChat;
