import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../help/socket';

const LiveTrackingPage = () => {
    const { sessionId, senderType } = useParams();
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const markerRefs = useRef({ user: null, officer: null }); // 💡 Use ref for immediate updates
    const lastCoordsRef = useRef({ user: null, officer: null });
    const [eta, setEta] = useState(null);

    useEffect(() => {
        if (!sessionId || !senderType || !map) return;

        socket.emit('joinTrackingRoom', { sessionId });

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                socket.emit('locationUpdate', { sessionId, senderType, coords });
                updateMarker(senderType, coords);
                lastCoordsRef.current[senderType] = coords;
            },
            (error) => console.error("Error getting position", error),
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 20000
            }
        );

        socket.on('locationUpdate', ({ senderType: incomingType, coords }) => {
            updateMarker(incomingType, coords);
            lastCoordsRef.current[incomingType] = coords;
        });

        const interval = setInterval(() => {
            const { user, officer } = lastCoordsRef.current;
            if (user && officer) {
                calculateETA(officer, user);
            }
        }, 15000);

        return () => {
            navigator.geolocation.clearWatch(watchId);
            socket.off('locationUpdate');
            clearInterval(interval);
        };
    }, [sessionId, senderType, map]);

    const updateMarker = (type, coords) => {
        if (!map) return;

        // 💥 Remove the old marker from the map
        if (markerRefs.current[type]) {
            markerRefs.current[type].setMap(null);
        }

        const newMarker = new window.google.maps.Marker({
            position: coords,
            map,
            label: type === 'user' ? 'U' : 'O',
        });

        markerRefs.current[type] = newMarker;
        map.setCenter(coords);
    };

    const calculateETA = (origin, destination) => {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: window.google.maps.TravelMode.DRIVING,
        }, (response, status) => {
            if (status === 'OK') {
                const result = response.rows[0].elements[0];
                if (result.status === 'OK') {
                    setEta(result.duration.text);
                } else {
                    console.warn('ETA unavailable:', result.status);
                }
            } else {
                console.error('DistanceMatrix error:', status);
            }
        });
    };

    useEffect(() => {
        if (!mapRef.current) return;
        const googleMap = new window.google.maps.Map(mapRef.current, {
            center: { lat: 23.8103, lng: 90.4125 },
            zoom: 15,
            gestureHandling: "greedy",
            disableDefaultUI: true,
            mapTypeControl: false,
        });
        setMap(googleMap);
    }, []);

    return (
        <div className="w-full h-screen relative">
            <div ref={mapRef} className="w-full h-full" />
            {eta && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded shadow-md z-10">
                    Estimated arrival: {eta}
                </div>
            )}
        </div>
    );
};

export default LiveTrackingPage;
