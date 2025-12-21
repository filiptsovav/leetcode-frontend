import React from "react";
import "./chat.css";

export default function ChatSidebar({ chats, activeChatId, onSelect, onCreateClick, currentUser }) {
  
  // Хелпер для красивого названия чата
  const getChatName = (chat) => {
    if (chat.isAnnouncement) return "🔥 Advertisements"; 
    if (chat.isPublic) return "📢 General Chat";
    
    // ДОБАВЛЕНА ЗАЩИТА: (chat.users || [])
    // Если users undefined, код не упадет
    const otherUser = (chat.users || []).find(u => u !== currentUser);
    return otherUser || "Unknown User";
  };

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h3>Messages</h3>
        <button onClick={onCreateClick} className="add-chat-btn" title="New Chat">+</button>
      </div>
      
      <div className="chat-list">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            className={`chat-item ${activeChatId === chat.id ? "active" : ""}`}
            onClick={() => onSelect(chat.id)}
          >
            <div className="chat-avatar">
              {chat.isAnnouncement ? "🔥" : (chat.isPublic ? "📢" : "👤")}
            </div>
            <div className="chat-info">
              <div className="chat-name">{getChatName(chat)}</div>
              <div className="chat-preview">
                {chat.messages && chat.messages.length > 0 
                  ? chat.messages[chat.messages.length - 1].text 
                  : "No messages yet"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}