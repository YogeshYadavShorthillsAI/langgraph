import React, { useState } from 'react';

const Sidebar = ({ 
  threads, 
  currentThreadId, 
  onThreadSelect, 
  onNewThread, 
  onDeleteThread, 
  onRenameThread 
}) => {
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const startEditing = (threadId, currentTitle) => {
    setEditingThreadId(threadId);
    setEditingTitle(currentTitle);
  };

  const saveEdit = () => {
    if (editingTitle.trim()) {
      onRenameThread(editingThreadId, editingTitle.trim());
    }
    setEditingThreadId(null);
    setEditingTitle('');
  };

  const cancelEdit = () => {
    setEditingThreadId(null);
    setEditingTitle('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const sortedThreads = Object.values(threads || {}).sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewThread}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {sortedThreads.length === 0 ? (
            <div className="text-gray-400 text-sm p-4 text-center">
              No conversations yet
            </div>
          ) : (
            sortedThreads.map((thread) => (
              <div
                key={thread.id}
                className={`group relative rounded-lg mb-1 ${
                  currentThreadId === thread.id 
                    ? 'bg-gray-800' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <div
                  className="flex items-center p-3 cursor-pointer"
                  onClick={() => editingThreadId !== thread.id && onThreadSelect(thread.id)}
                >
                  <div className="flex-1 min-w-0">
                    {editingThreadId === thread.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyPress}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm border-none outline-none"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm text-gray-300 truncate">
                          {thread.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {editingThreadId !== thread.id && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(thread.id, thread.title);
                        }}
                        className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                        title="Rename"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {Object.keys(threads).length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteThread(thread.id);
                          }}
                          className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400"
                          title="Delete"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          {Object.keys(threads || {}).length} conversation{Object.keys(threads || {}).length !== 1 ? 's' : ''}
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          Backend: LangGraph + FastAPI
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
