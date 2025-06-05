import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
    transports: ['websocket', 'polling'], // Allow both WebSocket and HTTP long-polling
    reconnectionAttempts: 5,
});

export default socket;