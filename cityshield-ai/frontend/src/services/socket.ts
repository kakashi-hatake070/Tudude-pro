import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || 'http://localhost:5001';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => {
  console.log('[CityShield Socket] Connected to real-time event bus, ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[CityShield Socket] Disconnected from server');
});
