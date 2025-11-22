import React from "react";

export default function ChatList({ chats, activeChatId, onSelectChat, onCreateChat }) {
  return (
    <aside className="chat-list" aria-label="Chat list">
      <div className="chat-list-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div>Chats</div>
        <button
          title="Create new chat"
          onClick={() => {
            const username = prompt("Введите username пользователя для нового чата:");
            if (username) onCreateChat(username);
          }}
        >
          +
        </button>

      </div>

      <div className="chat-items-scroll" role="list">
        {chats.map((c) => (
          <div
            key={c.id}
            role="listitem"
            className={`chat-item ${activeChatId === c.id ? "active" : ""}`}
            onClick={() => onSelectChat(c.id)}
            style={{ outline: 'none' }}
            tabIndex={0}
          >
            <img className="chat-avatar" src={c.avatar} alt={`${c.name} avatar`} />
            <div className="chat-info">
              <div className="chat-title">{c.name}</div>
              <div className="chat-last">
                {c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].text : "No messages"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
