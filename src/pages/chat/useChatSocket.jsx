import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8080/ws";

export function useChatSocket(onMessageReceived) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const subscriptionsRef = useRef(new Map()); // Храним подписки, чтобы не дублировать

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Создаем клиент
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_URL}?access_token=${token}`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000, // Авто-реконнект через 5 сек
      onConnect: () => {
        console.log("🟢 WS Connected");
        setConnected(true);
        
        // 1. Глобальная подписка на личные уведомления (для всех чатов)
        client.subscribe("/user/queue/messages", (message) => {
           const body = JSON.parse(message.body);
           onMessageReceived(body);
        });
      },
      onDisconnect: () => {
        console.log("🔴 WS Disconnected");
        setConnected(false);
        subscriptionsRef.current.clear();
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []); // Выполняется один раз при маунте

  // Функция для подписки на конкретный открытый чат (например, Public Chat)
  const subscribeToChat = useCallback((chatId) => {
    if (!clientRef.current || !clientRef.current.connected) return;

    const topic = `/topic/chats/${chatId}`;
    if (subscriptionsRef.current.has(topic)) return; // Уже подписаны

    console.log(`Subscribing to ${topic}`);
    const sub = clientRef.current.subscribe(topic, (message) => {
      const body = JSON.parse(message.body);
      onMessageReceived(body);
    });
    
    subscriptionsRef.current.set(topic, sub);
  }, [connected, onMessageReceived]);

  // Отправка сообщения через сокет (быстрее чем REST)
  const sendMessageWS = useCallback((messageDto) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messageDto),
      });
      return true;
    }
    return false; // Сокет не готов, нужно слать через REST
  }, [connected]);

  return { connected, subscribeToChat, sendMessageWS };
}