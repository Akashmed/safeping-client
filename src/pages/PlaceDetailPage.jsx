// src/pages/PlaceDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useGoogleMaps } from '../context/GoogleMapsProvider';
import { useParams, useLocation } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { RefreshCw } from 'lucide-react';

const mapContainerStyle = { width: '100%', height: '550px' };

const PlaceDetailPage = () => {
    const { placeId } = useParams();
    const location = useLocation();
    const userLocation = location.state?.userLocation;
    const { isLoaded } = useGoogleMaps();

    const [place, setPlace] = useState(null);
    const [error, setError] = useState(null);
    const [currentUserLocation, setCurrentUserLocation] = useState(userLocation);

    // 👇 Refresh function
    const fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCurrentUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                console.error('Location error:', err);
            },
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        if (!isLoaded || !placeId) return;
        if (!window.google) {
            setError('Google Maps API not loaded');
            return;
        }

        const map = new window.google.maps.Map(document.createElement('div'));
        const service = new window.google.maps.places.PlacesService(map);

        service.getDetails({ placeId }, (result, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlace(result);
            } else {
                setError('Failed to fetch place details');
            }
        });
    }, [isLoaded, placeId]);

    if (!isLoaded) return <div>Loading Google Maps...</div>;
    if (!userLocation) return <div>User location not provided.</div>;
    if (error) return <div className="text-red-600 p-4">{error}</div>;
    if (!place) return <div>Loading place details...</div>;

    const placeLoc = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
    };

    // Center map between user and place (midpoint)
    const center = {
        lat: (currentUserLocation.lat + placeLoc.lat) / 2,
        lng: (currentUserLocation.lng + placeLoc.lng) / 2,
    };


    return (
        <div className="p-4 relative">
            <h1 className="text-2xl font-bold mb-4">{place.name}</h1>
            <button
                onClick={fetchLocation}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#4285F4',
                    color: '#fff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                }}
                title="Refresh Location"
            >
                <RefreshCw size={24} />
            </button>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13}>
                <Marker
                    position={userLocation}
                    icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        scaledSize: new window.google.maps.Size(40, 40),
                    }}
                    title="Your Location" />
                <Marker position={placeLoc} title={place.name} />
            </GoogleMap>
        </div>
    );
};

export default PlaceDetailPage;
