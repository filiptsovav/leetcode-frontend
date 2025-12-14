import React, { useEffect, useState, useCallback } from "react";
import { fetchMyChats, fetchChatMessages, createPrivateChat, sendMessageRest } from "./ChatApi";
import { useChatSocket } from "./useChatSocket";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useNavigate } from "react-router-dom";
import "./chat.css";

export default function ChatPage() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("username");
  
  // State
  const [chats, setChats] = useState([]); 
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Callback для обработки входящих сообщений (от сокета)
  const handleIncomingMessage = useCallback((msgDto) => {
    setChats((prevChats) => {
      // Ищем чат, к которому относится сообщение
      const chatIndex = prevChats.findIndex(c => c.id === msgDto.chatId);
      
      if (chatIndex === -1) {
        // Если чата нет в списке (новый приватный чат), по идее нужно перезагрузить список чатов
        // Но пока просто игнорируем или можно вызвать fetchMyChats()
        return prevChats; 
      }

      // Обновляем список сообщений конкретного чата
      const updatedChats = [...prevChats];
      const chat = updatedChats[chatIndex];
      
      // Проверка на дубликаты (если вдруг сообщение пришло дважды)
      if (!chat.messages.some(m => m.id === msgDto.id)) {
        chat.messages = [...chat.messages, msgDto];
      }
      
      // Перемещаем активный чат вверх списка (как в Telegram)
      updatedChats.splice(chatIndex, 1);
      updatedChats.unshift(chat);
      
      return updatedChats;
    });
  }, []);

  // 2. Подключаем WebSocket
  const { connected, subscribeToChat, sendMessageWS } = useChatSocket(handleIncomingMessage);

  // 3. Загрузка списка чатов при старте
  useEffect(() => {
    async function init() {
      try {
        if (!currentUser) { navigate("/login"); return; }
        const myChats = await fetchMyChats();
        // Добавляем поле messages: [], если его нет
        const formattedChats = myChats.map(c => ({ ...c, messages: [] }));
        setChats(formattedChats);
        
        // По умолчанию открываем первый (обычно Public)
        if (formattedChats.length > 0) setActiveChatId(formattedChats[0].id);
      } catch (e) {
        console.error("Error loading chats", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [currentUser, navigate]);

  // 4. При выборе чата -> Подписываемся на топик и грузим историю
  useEffect(() => {
    if (!activeChatId) return;

    // Подписываемся через сокет на этот конкретный чат
    subscribeToChat(activeChatId);

    // Грузим историю сообщений через REST
    fetchChatMessages(activeChatId).then((msgs) => {
      setChats(prev => prev.map(c => 
        c.id === activeChatId ? { ...c, messages: msgs } : c
      ));
    });

  }, [activeChatId, subscribeToChat]);

  // 5. Отправка сообщения
  const handleSendMessage = async (chatId, text) => {
    const msgPayload = {
      chatId,
      text,
      senderUsername: currentUser
      // targetUsername можно добавить, если нужно, но бэкенд поймет и так через chatId
    };

    // Пытаемся отправить через сокет
    const sentViaWS = sendMessageWS(msgPayload);

    if (!sentViaWS) {
      // Если сокет отвалился, шлем через REST
      console.warn("WS disconnected, sending via REST...");
      try {
        const savedMsg = await sendMessageRest(chatId, text);
        // Вручную добавляем в стейт, так как сокет может не вернуть ответ
        handleIncomingMessage(savedMsg); 
      } catch (e) {
        alert("Failed to send message");
      }
    }
  };

  // 6. Создание нового чата
  const handleCreateChat = async () => {
    const username = prompt("Enter username to chat with:");
    if (!username || username === currentUser) return;
    
    try {
      const newChat = await createPrivateChat(username);
      // Проверяем, есть ли он уже
      if (!chats.find(c => c.id === newChat.id)) {
        setChats(prev => [{ ...newChat, messages: [] }, ...prev]);
      }
      setActiveChatId(newChat.id);
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="loading">Loading chats...</div>;

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="chat-layout">
      <div className="chat-container">
        <ChatSidebar 
          chats={chats} 
          activeChatId={activeChatId} 
          onSelect={setActiveChatId} 
          onCreateClick={handleCreateChat}
          currentUser={currentUser}
        />
        <ChatWindow 
          activeChat={activeChat} 
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
        />
      </div>
      <button className="back-btn" onClick={() => navigate("/dashboard")}>Exit</button>
    </div>
  );
}