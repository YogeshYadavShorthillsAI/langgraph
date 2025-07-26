import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [threadId, setThreadId] = useState('yogesh');

  const appendMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text, id: Date.now() }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = userInput.trim();
    const thread_id = threadId.trim() || "default";

    if (!message) return;

    appendMessage("user", message);
    setUserInput("");

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message, thread_id })
      });

      const data = await response.json();
      const reply = data.response || data.error || "Something went wrong!";
      appendMessage("bot", reply);
    } catch (error) {
      appendMessage("bot", "[❌ Error connecting to server]");
    }
  };

  return (
    <div style={{
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      backgroundColor: '#f0f2f5',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        width: '100%',
        margin: '50px auto',
        background: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#343541',
          color: '#fff',
          padding: '20px',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          LangGraph Chatbot
        </div>

        {/* Thread ID Section */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <label htmlFor="threadInput" style={{ fontWeight: 'bold' }}>
            Thread ID:
          </label>
          <input
            type="text"
            id="threadInput"
            value={threadId}
            onChange={(e) => setThreadId(e.target.value)}
            placeholder="Enter thread ID..."
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
        </div>

        {/* Chat Box - Reduced height */}
        <div style={{
          height: '350px',
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#f7f7f8',
          scrollBehavior: 'smooth'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                display: 'inline-block',
                maxWidth: '70%',
                padding: '12px 15px',
                borderRadius: '12px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontSize: '15px',
                backgroundColor: msg.sender === 'user' ? '#007bff' : '#e5e5ea',
                color: msg.sender === 'user' ? 'white' : '#111',
                borderBottomRightRadius: msg.sender === 'user' ? '0' : '12px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '12px'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            padding: '15px 20px',
            borderTop: '1px solid #ddd',
            backgroundColor: '#fff'
          }}
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            required
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginRight: '10px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              backgroundColor: '#343541',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2c2f38'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#343541'}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
