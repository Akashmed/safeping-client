// src/pages/PlaceDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useGoogleMaps } from '../context/GoogleMapsProvider';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

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
                title="Refresh Location"
                className="absolute bottom-[90px] lg:bottom-[20px] left-[22px] w-[48px] h-[48px] rounded-full border-none bg-[#4285F4] text-white shadow-md flex items-center justify-center cursor-pointer z-10"
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
            <button onClick={() => navigate(-1)} className="flex items-center mt-3 justify-center w-full px-5 py-2 text-sm text-gray-700 transition-colors duration-200 lg:hidden bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span>Go back</span>
            </button>
        </div>
    );
};

export default PlaceDetailPage;
