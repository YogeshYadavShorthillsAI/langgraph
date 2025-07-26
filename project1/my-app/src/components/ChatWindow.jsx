import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = ({ messages, onSend, isLoading, threadTitle }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100vh', backgroundColor: 'white' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '16px 20px' 
      }}>
        <h1 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#1f2937', 
          margin: 0 
        }}>
          {threadTitle}
        </h1>
      </div>

      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px' 
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%' 
          }}>
            <div style={{ 
              textAlign: 'center', 
              maxWidth: '400px', 
              padding: '20px' 
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                AI
              </div>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '8px' 
              }}>
                How can I help you today?
              </h2>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '14px', 
                marginBottom: '0' 
              }}>
                I can help with web searches, generate images, provide stock updates, and answer questions.
              </p>
            </div>
          </div>
        ) : (
          <div>
        {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px'
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    backgroundColor: msg.role === 'user' ? '#3b82f6' : '#f3f4f6',
                    color: msg.role === 'user' ? 'white' : '#1f2937'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    {msg.role === 'assistant' && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#3b82f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        AI
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {msg.content}
                      </div>
                      {msg.timestamp && (
                        <div style={{
                          fontSize: '11px',
                          marginTop: '4px',
                          opacity: 0.7,
                          color: msg.role === 'user' ? '#dbeafe' : '#6b7280'
                        }}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
          </div>
        ))}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  maxWidth: '70%'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      AI
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite'
                      }} />
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite 0.1s'
                      }} />
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite 0.2s'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        borderTop: '1px solid #e5e7eb', 
        padding: '16px', 
        backgroundColor: 'white' 
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message ChatBot..."
            disabled={isLoading}
            style={{
              flex: 1,
              border: '1px solid #d1d5db',
              borderRadius: '24px',
              padding: '12px 16px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: isLoading ? '#f9fafb' : 'white'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              backgroundColor: !input.trim() || isLoading ? '#d1d5db' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {isLoading ? '...' : '→'}
          </button>
      </form>
        <div style={{ 
          fontSize: '11px', 
          color: '#6b7280', 
          marginTop: '8px', 
          textAlign: 'center' 
        }}>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
