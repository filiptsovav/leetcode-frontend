import React, { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ chat, onSend }) {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState([]);
  const messagesRef = useRef(null);

  // sync localMessages each time меняется prop `chat`
  useEffect(() => {
    if (chat && chat.messages) {
      setLocalMessages(chat.messages);
      // прокрутка вниз при выборе чата
      setTimeout(() => {
        if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 50);
    } else {
      setLocalMessages([]);
    }
  }, [chat]);

  if (!chat) {
    return (
      <main className="chat-window" aria-live="polite">
        <div className="chat-placeholder">Select a chat to start</div>
      </main>
    );
  }

  function handleSend() {
    if (!input.trim()) return;
    // вызов родительского onSend — обновит chats в ChatCenter (источник правды)
    if (onSend) onSend(input.trim());
    // обновляем локально для мгновенного UX — родитель при обновлении props перезапишет
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: Date.now(), sender: "me", text: input.trim(), time: ts };
    setLocalMessages((m) => [...m, newMsg]);
    setInput("");
    // скролим вниз
    setTimeout(() => {
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 50);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="chat-window" aria-label={`Chat with ${chat.name}`}>
      <div className="chat-header">{chat.name}</div>

      <div className="messages-wrapper">
          <div className="messages-container" ref={messagesRef}>
            {localMessages.map((m) => (
              <MessageBubble key={m.id} msg={m} />
            ))}
          </div>
        </div>

      <div className="user-panel">
        <textarea
          className="message-input"
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" onClick={handleSend} aria-label="Send message">
          ➤
        </button>
      </div>
    </main>
  );
}
