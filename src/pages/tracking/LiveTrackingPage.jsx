import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../help/socket';

const LiveTrackingPage = () => {
    const { sessionId, senderType } = useParams();
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState({ user: null, officer: null });
    const [lastCoords, setLastCoords] = useState({ user: null, officer: null });
    const [eta, setEta] = useState(null);
    const directionsRendererRef = useRef(null);
    const initialRouteDrawn = useRef(false);
    const lastCoordsRef = useRef({ user: null, officer: null }); // NEW: ref to track coords

    // Update ref whenever lastCoords changes
    useEffect(() => {
        lastCoordsRef.current = lastCoords;
    }, [lastCoords]);

    useEffect(() => {
        if (!mapRef.current) return;
        const googleMap = new window.google.maps.Map(mapRef.current, {
            center: { lat: 23.8103, lng: 90.4125 },
            zoom: 15,
            gestureHandling: 'greedy',
            disableDefaultUI: true,
            mapTypeControl: false,
        });
        setMap(googleMap);

        const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map: googleMap,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#4285F4',
                strokeOpacity: 0.8,
                strokeWeight: 5,
            },
        });
        directionsRendererRef.current = directionsRenderer;
    }, []);

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
                setLastCoords((prev) => ({ ...prev, [senderType]: coords }));
            },
            (error) => console.error('Error getting position', error),
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 20000,
            }
        );

        socket.on('locationUpdate', ({ senderType: incomingType, coords }) => {
            updateMarker(incomingType, coords);
            setLastCoords((prev) => ({ ...prev, [incomingType]: coords }));
        });

        // FIXED: Use ref instead of state in interval, removed lastCoords from dependencies
        const interval = setInterval(() => {
            const currentCoords = lastCoordsRef.current;
            if (currentCoords.user && currentCoords.officer) {
                calculateETA(currentCoords.officer, currentCoords.user);
                drawRoute(currentCoords.officer, currentCoords.user);
            }
        }, 5000);

        return () => {
            navigator.geolocation.clearWatch(watchId);
            socket.off('locationUpdate');
            clearInterval(interval);
        };
    }, [sessionId, senderType, map]); // FIXED: Removed lastCoords from dependencies

    // Trigger FIRST draw of route and ETA as soon as both coords available
    useEffect(() => {
        if (
            lastCoords.user &&
            lastCoords.officer &&
            !initialRouteDrawn.current
        ) {
            calculateETA(lastCoords.officer, lastCoords.user);
            drawRoute(lastCoords.officer, lastCoords.user);
            initialRouteDrawn.current = true;
        }
    }, [lastCoords.user, lastCoords.officer]);

    const updateMarker = (type, coords) => {
        if (!map) return;

        setMarkers((prev) => {
            // Remove existing marker if it exists
            if (prev[type]) {
                prev[type].setMap(null);
            }

            // Create new marker at updated position
            const marker = new window.google.maps.Marker({
                position: coords,
                map,
                label: type === 'user' ? 'U' : 'O',
                optimized: true,
            });

            // Center map when first marker appears
            if (!prev.user || !prev.officer) {
                map.setCenter(coords);
            }

            return { ...prev, [type]: marker };
        });
    };

    const calculateETA = (origin, destination) => {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === 'OK') {
                    const result = response.rows[0].elements[0];
                    setEta(result.duration.text);
                }
            }
        );
    };

    const drawRoute = (origin, destination) => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK' && directionsRendererRef.current) {
                    directionsRendererRef.current.setDirections(result);
                } else {
                    console.error('Could not display directions:', status);
                }
            }
        );
    };

    return (
        <div className="w-full h-screen relative">
            <div ref={mapRef} className="w-full h-full" />
            {eta && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded shadow-md">
                    Estimated arrival: {eta}
                </div>
            )}
        </div>
    );
};

export default LiveTrackingPage;