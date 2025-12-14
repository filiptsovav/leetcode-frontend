const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// Получаем токен и формируем заголовки
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

// 1. Загрузить список чатов (включая публичный)
export const fetchMyChats = async () => {
  const res = await fetch(`${API_BASE}/api/chats`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json();
};

// 2. Загрузить историю сообщений конкретного чата
export const fetchChatMessages = async (chatId) => {
  const res = await fetch(`${API_BASE}/api/chats/${chatId}/messages`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};

// 3. Создать (или найти) приватный чат с юзером
export const createPrivateChat = async (targetUsername) => {
  const res = await fetch(`${API_BASE}/api/chats/create?username=${targetUsername}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create chat");
  }
  return res.json();
};

// 4. Отправить сообщение через REST (как фоллбэк или основной метод)
export const sendMessageRest = async (chatId, text) => {
  const res = await fetch(`${API_BASE}/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
};