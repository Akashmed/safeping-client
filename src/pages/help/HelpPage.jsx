import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import socket from './socket';

const HelpPage = () => {
    const { placeId } = useParams();
    const { user, loading } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        if (loading || !user?.uid || !placeId) return;

        // Clean old listeners to avoid duplicates
        socket.off("connect");
        socket.off("helpAccepted");

        // Add listener for new connection
        socket.on("connect", () => {
            console.log("Connected to socket server with ID:", socket.id);
        });

        // Always emit userConnected — even if already connected
        if (socket.connected) {
            // console.log("Socket already connected, emitting userConnected");
            socket.emit('userConnected', { userId: user.uid, institutionId: placeId });
        } else {
            console.log("Socket not connected yet, will emit on connect");
            socket.on("connect", () => {
                socket.emit('userConnected', { userId: user.uid, institutionId: placeId });
            });
        }

        // // Emit help request
        // console.log("Emitting helpRequest for user:", user.uid);
        // socket.emit('helpRequest', { userId: user.uid });

        // Handle response from institution
        socket.on('helpAccepted', (data) => {
            console.log("Help accepted by institution:", data);
            // TODO: Navigate to tracking page
            navigate(`/track/${user.uid}-${placeId}/user`);

        });

        // Cleanup on unmount
        return () => {
            socket.emit("clientDisconnected", { clientId: user?.uid });
            socket.off("connect");
            socket.off("helpAccepted");
        };

    }, [user?.uid, placeId, loading, navigate]);


    return (
        <div className='dark:bg-slate-900 min-h-screen'>
            <p className='text-white p-3 text-xl'>Congratulations, Your request has been successfully submitted! Please wait in this page</p>
        </div>
    );
};

export default HelpPage;