import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../help/socket';

const RequestsPage = () => {
    const { placeId } = useParams();
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!placeId) return;

        socket.off('connect');
        socket.off('helpRequest');


        // Connect to socket server and log the socket ID
        socket.on("connect", () => {
            console.log("Institution Connected to socket server with ID:", socket.id);
        });

        if (socket.connected && placeId) {
            socket.emit('institutionConnected', { institutionId: placeId });
        }else{
            console.log("Socket not connected yet, will emit on connect");
            socket.on("connect", () => {
                socket.emit('institutionConnected', { institutionId: placeId });
            });
        }

        socket.on('helpRequest', (data) => {
            console.log("Help request received:", data);
            setRequests((prevRequests) => [...prevRequests, data]);
        });

        return () => {
            socket.emit("clientDisconnected", { placeId });
            socket.off("connect");
            socket.off("disconnect");
        };

    }, [placeId]);

    const handleHelp = (userId) => {
        // navigate to tracking page
        socket.emit('helpAccepted', { userId, institutionId: placeId });
        navigate(`/track/${userId}-${placeId}/officer`);
        setRequests([]);
    }

    const handleDeny = (userId) => {
        setRequests((prev) => prev.filter(r => r.userId !== userId));
        // Optionally notify user via socket
    };


    return (
        <div>
            {
                requests && requests.length > 0 ? (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Help Requests</h2>
                        <div className="space-y-4">
                            {requests.map((request, index) => (
                                <div key={index} className="p-4 border rounded shadow-sm">
                                    <p><strong>Sender ID:</strong> {request.userId}</p>
                                    <p><strong>Message:</strong> {request.message || 'no message'}</p>
                                    <p><strong>Time:</strong> {request.time}</p>
                                    <div className='flext justify-center items-center gap-2 mt-4'>
                                        <button onClick={() => handleHelp(request?.userId)} className='px-3 py-2 border-1'>Help</button>
                                        <button className='px-3 py-2 border-1' onClick={() => handleDeny(request.userId)}>Deny</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                ) : (
                    <div className="p-4 text-gray-500">No help requests at the moment.</div>
                )
            }

        </div>
    );
};

export default RequestsPage;