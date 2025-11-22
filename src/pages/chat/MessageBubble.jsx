import React from "react";

export default function MessageBubble({ msg }) {
  const isMine = msg.sender === "me" || msg.sender === "agent" || msg.sender === "admin";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
      }}
    >
      <div className={`bubble ${isMine ? "me" : "other"}`} aria-label="message">
        <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
        <div className="time">{msg.time}</div>
      </div>
    </div>
  );
}
