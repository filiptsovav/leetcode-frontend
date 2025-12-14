import React, { useState, useEffect, useRef } from "react";
import "./chat.css";

export default function ChatWindow({ activeChat, currentUser, onSendMessage }) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Права на запись: если это НЕ объявление ИЛИ если я админ
  const canWrite = !activeChat?.isAnnouncement || currentUser === "123123";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  if (!activeChat) {
    return <div className="chat-placeholder">Select a chat to start messaging</div>;
  }

  // Безопасное получение имени собеседника
  const chatPartner = (activeChat.users || []).find(u => u !== currentUser) || "Chat";

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeChat.id, inputText);
    setInputText("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
         {activeChat.isAnnouncement ? "🔥 Advertisements (Read Only)" : 
          activeChat.isPublic ? "📢 General Chat" : 
          `👤 ${chatPartner}`}
      </div>

      <div className="messages-area">
        {activeChat.messages?.map((msg) => {
          const isMe = msg.senderUsername === currentUser;
          return (
            <div key={msg.id || Math.random()} className={`message-row ${isMe ? "my-message" : "other-message"}`}>
              {!isMe && <div className="message-sender">{msg.senderUsername}</div>}
              <div className="message-bubble">
                {msg.text}
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {canWrite ? (
        <form className="input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder={activeChat.isAnnouncement ? "Post an ad..." : "Type a message..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      ) : (
        <div style={{ padding: 20, textAlign: "center", color: "#888", background: "#f9f9f9", borderTop: "1px solid #ddd" }}>
          Only admin can post here.
        </div>
      )}
    </div>
  );
}