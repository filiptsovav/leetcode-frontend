import React from "react";

export default function UserPanel({ value, onChange, onSend }) {
  return (
    <div className="user-panel">
      <textarea
        className="message-input"
        placeholder="Введите ваше сообщение…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button className="send-btn" onClick={onSend}>
        ➤
      </button>
    </div>
  );
}
