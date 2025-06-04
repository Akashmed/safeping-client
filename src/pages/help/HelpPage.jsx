import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import socket from './socket';

const HelpPage = () => {
    const { placeId } = useParams();
    const { user, loading } = useAuth();
    console.log(user?.uid)

    useEffect(() => {

        socket.off('connect');
        socket.off('helpAccepted');

        // Connect to socket server and log the socket ID
        socket.on("connect", () => {
            console.log("Connected to socket server with ID:", socket.id);
            if (user?.uid && placeId) {
                socket.emit('userConnected', { userId: user.uid, institutionId: placeId });
            }
        });



        // // check if user is online
        // socket.on('userOnline', () => {
        //     setOnline(true);
        // });
        // // check if user is online
        // socket.on('userOffline', () => {
        //     setOnline(false);
        // });


        // Listen for incoming messages from the server
        socket.on('helpAccepted', (data) => {
            console.log("Help accepted by institution:", data);
            //navigate to tracking page
        });



        // Clean up all listeners when the component unmounts
        return () => {
            socket.emit("clientDisconnected", { clientId: user?.uid });
            socket.off("connect");
            socket.off("disconnect");
        };
    }, [user?.uid, placeId]);

    return (
        <div className='dark:bg-slate-900 min-h-screen'>
            <p className='text-white p-3 text-xl'>Congratulations, Your request has been successfully submitted! Please wait in this page</p>
        </div>
    );
};

export default HelpPage;