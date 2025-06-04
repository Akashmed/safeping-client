import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    transports: ['websocket', 'polling'], // Allow both WebSocket and HTTP long-polling
    reconnectionAttempts:5,
});

export default socket;