// src/ws/socket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_WS_BASE)
  ? import.meta.env.VITE_WS_BASE
  : "http://localhost:8080"; // fallback to backend

function getToken() {
  return localStorage.getItem("token");
}

export function createStompClient({ onConnect, onDisconnect, onStompError } = {}) {
  const token = getToken();
  const sockUrl = `${WS_BASE.replace(/\/$/, "")}/ws${token ? `?access_token=${encodeURIComponent(token)}` : ""}`;
  const client = new Client({
    webSocketFactory: () => new SockJS(sockUrl),
    reconnectDelay: 5000,
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    onConnect: frame => { if (onConnect) onConnect(frame); },
    onStompError: frame => { if (onStompError) onStompError(frame); },
    onDisconnect: () => { if (onDisconnect) onDisconnect(); }
  });
  return client;
}
