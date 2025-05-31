import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { RefreshCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const libraries = ['places'];

// ...rest of your imports
const GoogleMapComponent = () => {
  const [searchParams] = useSearchParams();
  const placeType = searchParams.get('type');
  const validTypes = ['police', 'hospital', 'fire_station'];
  const safePlaceType = validTypes.includes(placeType) ? placeType : null;

  const [currentPosition, setCurrentPosition] = useState(null);
  const [places, setPlaces] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

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
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (!currentPosition || !window.google) return;

    // ✅ Only search if placeType is valid
    if (!safePlaceType) {
      setPlaces([]); // clear old results
      return;
    }

    const map = new window.google.maps.Map(document.createElement('div'));
    const service = new window.google.maps.places.PlacesService(map);

    service.nearbySearch(
      {
        location: currentPosition,
        radius: 5000,
        type: safePlaceType,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
          console.log('Nearby Places:', results);
        } else {
          console.error('Places API error:', status);
        }
      }
    );
  }, [currentPosition, placeType]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!currentPosition) return <div>Getting your location...</div>;

  return (
    <div style={{ position: 'relative' }}>
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

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '550px' }}
        center={currentPosition}
        zoom={15}
      >
        <Marker
          position={currentPosition}
          title="You are here"
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />

        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={place.geometry.location}
            title={place.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;