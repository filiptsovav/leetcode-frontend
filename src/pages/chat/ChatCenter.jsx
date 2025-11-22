import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "../../index.css"; // глобальные базовые стили (если нужны)
import "./chat.css"; // <-- все стили чата здесь
import { useNavigate } from "react-router-dom";

// аватарки (положите файлы в src/assets/)
import avatar1 from "../../assets/avatar1.jpg";
import avatar2 from "../../assets/avatar2.jpg";

export default function ChatCenter() {
  // source of truth — список чатов и их сообщения в родителе
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Technical Support",
      avatar: avatar1,
      messages: [
        { id: 1, sender: "other", text: "Здравствуйте! Как могу помочь?", time: "10:12" },
        { id: 2, sender: "me", text: "У меня проблема с оплатой.", time: "10:14" },
      ],
    },
    {
      id: 2,
      name: "Operator Anna",
      avatar: avatar2,
      messages: [
        { id: 1, sender: "other", text: "Приложите скриншот ошибки, пожалуйста.", time: "09:01" },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState(null);

  // Создать новый чат (локально). Можно заменить на POST /api/chats
  function createNewChat(username) {
    if (!username) return;
    // логика как раньше, но с указанным username
    const user = userRepository.findByUsername(username); // или fetch на бэк
    if (!user) return alert("Пользователь не найден");

    const newId = Date.now();
    const newChat = {
      id: newId,
      name: username,
      avatar: avatar1,
      messages: [
        { id: 1, sender: "system", text: "Новый чат создан. Напишите сообщение.", time: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) }
      ]
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
  }


  // Отправка сообщения: обновляет chats в родителе => ChatWindow получает свежие props
  function sendMessage(chatId, text) {
    if (!text || !text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: Date.now(), sender: "me", text: text.trim(), time: ts },
              ],
            }
          : c
      )
    );

    // integration point:
    // fetch(`/api/chats/${chatId}/messages`, { method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'text', content:text })})
  }

  const navigate = useNavigate();
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  return (
    <div className="chat-layout" role="application" aria-label="Chat center">
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(chatId) => setActiveChatId(chatId)}
        onCreateChat={createNewChat}
      />
      <button
        className="btn btn-secondary chat-back-btn"
        onClick={() => navigate("/dashboard")}
        style={{position: 'absolute', top: 10, left: 10}}
      >
        ← Dashboard
      </button>


      <ChatWindow chat={activeChat} onSend={(text) => sendMessage(activeChatId, text)} />
    </div>
  );
}
