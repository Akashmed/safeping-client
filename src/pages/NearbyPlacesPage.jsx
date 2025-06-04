// src/pages/NearbyPlacesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useGoogleMaps } from '../context/GoogleMapsProvider';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchNearbyPlaces, getDistanceFromLatLonInKm, getPlaceDetails } from '../utils/mapUtils';
import toast from 'react-hot-toast';
import Hashloader from '../components/loader/Hashloader';

const validTypes = ['police', 'hospital', 'fire_station'];

const NearbyPlacesPage = () => {
    const { isLoaded } = useGoogleMaps();
    const [searchParams] = useSearchParams();
    const placeType = searchParams.get('type');
    const safePlaceType = validTypes.includes(placeType) ? placeType : null;

    const [currentPosition, setCurrentPosition] = useState(null);
    const [places, setPlaces] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCurrentPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                console.error('Location error:', err);
                setError('Failed to get location');
            },
            { enableHighAccuracy: true }
        );
    }, []);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    useEffect(() => {
        const fetchPlaces = async () => {
            if (!isLoaded || !currentPosition || !safePlaceType) return;

            setLoading(true);
            setError(null); // reset previous error
            try {
                const results = await fetchNearbyPlaces(currentPosition, safePlaceType);

                const placesWithDistance = results.map((place) => {
                    const lat2 = place.geometry.location.lat();
                    const lng2 = place.geometry.location.lng();
                    const distance = getDistanceFromLatLonInKm(
                        currentPosition.lat,
                        currentPosition.lng,
                        lat2,
                        lng2
                    );
                    return { ...place, distance };
                });

                const sortedTop10 = placesWithDistance
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 10);

                const detailedPlaces = await Promise.all(
                    sortedTop10.map(async (place) => {
                        try {
                            const details = await getPlaceDetails(place.place_id);
                            return {
                                ...place,
                                phoneNumber: details.formatted_phone_number || null,
                            };
                        } catch {
                            return { ...place, phoneNumber: null };
                        }
                    })
                );
                setPlaces(detailedPlaces);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch nearby places.');
            } finally {
                setLoading(false); // ✅ Always turn off loading at the end
            }
        };

        fetchPlaces();
    }, [isLoaded, currentPosition, safePlaceType]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (!isLoaded && !error) {
            toast.loading('Loading Google Maps...', { id: 'map-loading' });
        } else {
            toast.dismiss('map-loading');
        }
    }, [isLoaded, error]);

    useEffect(() => {
        if (!currentPosition && isLoaded && !error) {
            toast.loading('Fetching your location...', { id: 'location-loading' });
        } else {
            toast.dismiss('location-loading');
        }
    }, [currentPosition, isLoaded, error]);

    if (loading) return <Hashloader />

    return (
        <div className="p-4">
            <h1 className="text-xl text-white font-bold mb-4">Nearby {safePlaceType?.replace('_', ' ')}</h1>
            {places.length === 0 && <p className='text-gray-200'>No places found nearby.</p>}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {places.map((place) => (
                    <div
                        key={place.place_id}
                        className="border rounded-lg p-4 shadow bg-white">
                        <h3 className="font-semibold">{place.name}</h3>
                        <p>{place.distance.toFixed(2)} km away</p>

                        {place.phoneNumber ? (
                            <a
                                href={`tel:${place.phoneNumber}`}
                                className="inline-block mt-3 mr-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Call Now
                            </a>
                        ) : (
                            <p className="text-sm text-gray-500 italic mt-3">Phone number not available</p>
                        )}

                        <button
                            className="mt-3 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() =>
                                navigate(`/place/${place.place_id}`, {
                                    state: { userLocation: currentPosition },
                                })
                            }
                        >
                            View on Map
                        </button>
                        <Link to={`/help/${place.place_id}`} className='mt-3 cursor-pointer ml-3 px-5 py-2 bg-red-700 text-white rounded hover:bg-red-800'>
                            Help
                        </Link>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default NearbyPlacesPage;
